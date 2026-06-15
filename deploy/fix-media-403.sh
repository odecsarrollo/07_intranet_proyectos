#!/usr/bin/env bash
# Corrige /media/ on-prem: Nginx → Gunicorn (sin SELinux) + contenedor con volumen ./media montado.
# Uso: sudo ./deploy/fix-media-403.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Ejecuta con sudo: sudo $0" >&2
  exit 1
fi

echo "==> 1/2 Nginx: /media/ y /static/ (media por proxy a Gunicorn)"
install -m 0640 -o root -g nginx "$ROOT/intranet_proyectos.conf" /etc/nginx/conf.d/intranet_proyectos.conf
nginx -t
systemctl reload nginx

echo "==> 2/2 Recrear contenedor web (monta ./media → /app/media, SERVE_MEDIA)"
if sudo podman ps -q 2>/dev/null | grep -q .; then
  sudo podman-compose up -d --build --force-recreate web
else
  podman-compose up -d --build --force-recreate web
fi

sleep 5
PDF="/media/documentos/cotizaciones/4185/COTIZACION_2026119474529_SER-25120794-LINER-SERVICIO_DE_ENV_Z8x89Mw.pdf"
code=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: proyectos.odecopack.co" "http://127.0.0.1${PDF}")
echo "Prueba $PDF -> HTTP $code (esperado 200)"
if [[ "$code" != "200" ]]; then
  echo "Si sigue 404: comprobar volumen: podman-compose exec web ls -la /app/media/documentos/cotizaciones/4185/ | head"
  echo "Si prefieres Nginx directo al disco y ves 403: sudo $ROOT/deploy/fix-nginx-static-perms.sh"
fi
