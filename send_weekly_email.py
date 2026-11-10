#!/usr/bin/env python3
"""
Script de envío de reporte semanal por correo para Jesús Espinosa.
Destinatario: jesuss.espinosamusic@gmail.com
"""

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

DEST_EMAIL = "jesuss.espinosamusic@gmail.com"
SENDER_EMAIL = os.getenv("GMAIL_USER", DEST_EMAIL)
SENDER_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")

def build_email_content():
    today_str = datetime.now().strftime("%d/%m/%Y")
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0b0c10; color: #E2E4E3; padding: 20px; }}
        .container {{ max-width: 650px; margin: 0 auto; background-color: #16181f; border-radius: 14px; border: 1px solid #2a2e39; padding: 30px; }}
        .header {{ text-align: center; border-bottom: 1px solid #2a2e39; padding-bottom: 20px; margin-bottom: 25px; }}
        .brand-title {{ font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 2px; margin: 0; }}
        .brand-subtitle {{ font-size: 12px; color: #8fa5ff; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 5px; }}
        .motto {{ font-style: italic; color: #a0a5ad; font-size: 13px; margin-top: 10px; }}
        .stat-grid {{ display: flex; gap: 10px; margin-bottom: 25px; }}
        .stat-card {{ flex: 1; background: #202430; border-radius: 8px; padding: 12px; text-align: center; }}
        .stat-num {{ font-size: 20px; font-weight: bold; color: #ffffff; }}
        .stat-lbl {{ font-size: 11px; color: #8fa5ff; text-transform: uppercase; }}
        .section-title {{ font-size: 15px; font-weight: 700; color: #ffffff; border-left: 3px solid #670001; padding-left: 10px; margin: 20px 0 10px; }}
        ul {{ padding-left: 20px; font-size: 13px; color: #c4c7cc; line-height: 1.6; }}
        li {{ margin-bottom: 6px; }}
        .footer {{ text-align: center; margin-top: 30px; font-size: 11px; color: #6b7280; border-top: 1px solid #2a2e39; padding-top: 15px; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="brand-title">JESÚS ESPINOSA</h1>
          <div class="brand-subtitle">Reporte Semanal de Inteligencia & Marketing · {today_str}</div>
          <div class="motto">"La esencia es el servicio y la meta es la adoración"</div>
        </div>

        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-num">94</div>
            <div class="stat-lbl">Oyentes Spotify</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">4 Tracks</div>
            <div class="stat-lbl">Catálogo Activo</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">3 Arquetipos</div>
            <div class="stat-lbl">Buyer Personas</div>
          </div>
        </div>

        <div class="section-title">1. Enfoque Táctico de la Semana (Artista Cristiano)</div>
        <ul>
          <li><strong>Catálogo a Destacar:</strong> <em>"Abba Padre"</em> (Reel acústico devocional) y <em>"Mi Corazón - Acoustic Version"</em>.</li>
          <li><strong>Pilar de Redes:</strong> Publicar 4 Reels enfocados en el gancho de la historia real detrás de las canciones.</li>
          <li><strong>Spotify Canvas:</strong> Mantener activos los video-loops de 8 segundos con estética de degradado cromático y grano visual.</li>
        </ul>

        <div class="section-title">2. Enfoque Táctico de la Semana (Productor Musical)</div>
        <ul>
          <li><strong>Campaña "Auditoría Gratuita de Maquetas":</strong> Responder a DMs de líderes de alabanza y directores musicales.</li>
          <li><strong>Contenido de Estudio:</strong> Compartir clip corto mostrando la ecualización y calidez de guitarras acústicas en el DAW.</li>
        </ul>

        <div class="section-title">3. Recordatorio de Misión</div>
        <p style="font-size: 13px; color: #a0a5ad; line-height: 1.5;">
          "La música no es el destino, es el medio. Servir es nuestro fundamento. La música es nuestro lenguaje. La adoración es nuestro destino."
        </p>

        <div class="footer">
          Suite de Inteligencia Estratégica · Jesús Espinosa · jesuss.espinosamusic@gmail.com
        </div>
      </div>
    </body>
    </html>
    """
    return html

def send_email():
    if not SENDER_PASSWORD:
        print("[INFO] GMAIL_APP_PASSWORD no configurado en variables de entorno.")
        print("[INFO] Generando el reporte semanal en formato HTML listo para envío.")
        content = build_email_content()
        with open("ultimo_reporte_semanal.html", "w", encoding="utf-8") as f:
            f.write(content)
        print("Reporte guardado en: ultimo_reporte_semanal.html")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Jesús Espinosa · Reporte Semanal de Estrategia & Audiencia ({datetime.now().strftime('%d/%m/%Y')})"
        msg["From"] = SENDER_EMAIL
        msg["To"] = DEST_EMAIL

        html_body = build_email_content()
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, DEST_EMAIL, msg.as_string())
        print(f"[EXITO] Correo enviado exitosamente a {DEST_EMAIL}")
        return True
    except Exception as e:
        print(f"[ERROR] Error enviando correo: {e}")
        return False

if __name__ == "__main__":
    send_email()
