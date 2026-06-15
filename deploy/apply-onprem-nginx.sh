#!/usr/bin/env bash
# Instala la config Nginx on-prem (proxy /static/ y /media/ a Gunicorn) y recarga.
# Ejecutar: sudo ./deploy/apply-onprem-nginx.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Ejecuta con sudo: sudo $0" >&2
  exit 1
fi

install -m 0640 -o root -g nginx "$ROOT/intranet_proyectos.conf" /etc/nginx/conf.d/intranet_proyectos.conf
nginx -t
systemctl reload nginx

echo "Pruebas (deben ser 200, no 403):"
curl -sI "http://127.0.0.1/static/assets/bundles/dist/app-9aaae67f2ea3ebf9fe53.css" -H "Host: 10.75.45.4" | head -n 1
curl -sI "http://127.0.0.1/media/documentos/cotizaciones/4211/COTIZACION_2026553905_PRUEBA.pdf" -H "Host: 10.75.45.4" | head -n 1
echo "Si /media/ sigue en 403 o 404: sudo $ROOT/deploy/fix-media-403.sh"
