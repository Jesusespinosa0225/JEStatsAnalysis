#!/bin/bash
cd "$(dirname "$0")"

# Iniciar servidor local Python en puerto 3000 si no está activo
if ! lsof -i :3000 > /dev/null 2>&1; then
  python3 server.py &
  sleep 0.8
fi

# Abrir en el navegador
if lsof -i :3000 > /dev/null 2>&1; then
  open "http://localhost:3000"
else
  open "index.html"
fi
