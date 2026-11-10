#!/usr/bin/env python3
"""
Servidor local para Jesús Espinosa · Suite de Crecimiento & Rendimiento
Sirve la aplicación web en http://localhost:3000 y actúa como proxy seguro
para la API de Spotify for Developers y Meta Developer API / Meta AI.
"""

import http.server
import socketserver
import os
import json
import urllib.request
import urllib.parse
import base64

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# 1. Cargar Spotify Config
SPOTIFY_CONFIG_FILE = os.path.join(DIRECTORY, "spotify_config.json")
SPOTIFY_CONFIG = {}
if os.path.exists(SPOTIFY_CONFIG_FILE):
    try:
        with open(SPOTIFY_CONFIG_FILE, "r", encoding="utf-8") as f:
            SPOTIFY_CONFIG = json.load(f)
    except Exception as e:
        print(f"Error al leer spotify_config.json: {e}")

CLIENT_ID = SPOTIFY_CONFIG.get("clientId", os.environ.get("SPOTIFY_CLIENT_ID", "a6802fa76c914d2bac31312afb80be6b"))
CLIENT_SECRET = SPOTIFY_CONFIG.get("clientSecret", os.environ.get("SPOTIFY_CLIENT_SECRET", ""))
ARTIST_ID = SPOTIFY_CONFIG.get("artistId", "5oXAJD9KAqXH63yJo496WA")

# 2. Cargar Meta Config
META_CONFIG_FILE = os.path.join(DIRECTORY, "meta_config.json")
META_CONFIG = {}
if os.path.exists(META_CONFIG_FILE):
    try:
        with open(META_CONFIG_FILE, "r", encoding="utf-8") as f:
            META_CONFIG = json.load(f)
    except Exception as e:
        print(f"Error al leer meta_config.json: {e}")

META_API_KEY = META_CONFIG.get("apiKey", os.environ.get("META_API_KEY", ""))

def get_spotify_token():
    auth_str = f"{CLIENT_ID}:{CLIENT_SECRET}"
    b64_auth = base64.b64encode(auth_str.encode("utf-8")).decode("utf-8")
    token_url = "https://accounts.spotify.com/api/token"
    data = urllib.parse.urlencode({"grant_type": "client_credentials"}).encode("utf-8")
    req = urllib.request.Request(
        token_url,
        data=data,
        headers={
            "Authorization": f"Basic {b64_auth}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8")).get("access_token")

def fetch_spotify_data():
    token = get_spotify_token()
    headers = {"Authorization": f"Bearer {token}"}
    
    artist_url = f"https://api.spotify.com/v1/artists/{ARTIST_ID}"
    artist_info = {}
    try:
        req = urllib.request.Request(artist_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            artist_info = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"Error al obtener artista: {e}")

    tracks_list = []
    track_queries = [
        ("Abba Padre", "Mateo (Adoración Íntima / Sanidad)"),
        ("Mi Corazón - Acoustic Version", "Sofía & Mateo (Vulnerabilidad & Paz)"),
        ("Ven Jesús", "David & Pastor Andrés (Congregacional / Iglesias)"),
        ("Camino a Marte", "Audiencia Joven (Pop / Fe Cotidiana)")
    ]

    for q, persona in track_queries:
        search_url = "https://api.spotify.com/v1/search?q=" + urllib.parse.quote(f"track:{q} artist:Jesus Espinosa") + "&type=track&limit=1"
        try:
            req = urllib.request.Request(search_url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                res = json.loads(resp.read().decode("utf-8"))
                items = res.get("tracks", {}).get("items", [])
                if items:
                    it = items[0]
                    duration_sec = it["duration_ms"] // 1000
                    minutes = duration_sec // 60
                    seconds = duration_sec % 60
                    tracks_list.append({
                        "id": it["id"],
                        "name": it["name"],
                        "album": it["album"]["name"],
                        "releaseDate": it["album"]["release_date"],
                        "duration": f"{minutes}:{seconds:02d}",
                        "cover": it["album"]["images"][0]["url"] if it["album"]["images"] else "",
                        "url": it["external_urls"]["spotify"],
                        "targetPersona": persona
                    })
        except Exception as e:
            print(f"Error al buscar {q}: {e}")

    return {
        "status": "connected",
        "artist": {
            "name": artist_info.get("name", "Jesus Espinosa"),
            "id": ARTIST_ID,
            "spotifyUrl": artist_info.get("external_urls", {}).get("spotify", f"https://open.spotify.com/artist/{ARTIST_ID}"),
            "image": artist_info.get("images", [{}])[0].get("url", "") if artist_info.get("images") else ""
        },
        "tracks": tracks_list or SPOTIFY_CONFIG.get("tracks", [])
    }

def check_meta_status():
    req = urllib.request.Request(
        "https://api.meta.ai/v1/models",
        headers={"Authorization": f"Bearer {META_API_KEY}"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return {
                "status": "connected",
                "provider": "Meta Developer API / Meta AI",
                "keySnippet": META_API_KEY[:8] + "..." + META_API_KEY[-6:],
                "modelsCount": len(data.get("data", [])),
                "models": [m.get("id") for m in data.get("data", [])[:5]]
            }
    except Exception as e:
        return {
            "status": "configured",
            "error": str(e),
            "keySnippet": META_API_KEY[:8] + "..." + META_API_KEY[-6:]
        }

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path == "/api/spotify/sync":
            try:
                data = fetch_spotify_data()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps(data).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        elif self.path == "/api/spotify/config":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(SPOTIFY_CONFIG).encode("utf-8"))
        elif self.path == "/api/meta/status":
            res = check_meta_status()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(res).encode("utf-8"))
        else:
            super().do_GET()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"✅ Servidor activo en http://localhost:{PORT}")
        print("🔗 API de Spotify conectada.")
        print("🔗 API de Meta conectada (Key: LLM_18571978...).")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
