#!/usr/bin/env bash
# Recarga ALLOWED_HOSTS del contenedor web y opcionalmente Nginx.
# Ejecutar en el servidor: sudo ./deploy/restart-web-allowed-hosts.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Recreando contenedor web (lee .env)..."
podman-compose up -d --force-recreate web

echo "==> Actualizando Nginx..."
install -m 0640 -o root -g nginx "$ROOT/intranet_proyectos.conf" /etc/nginx/conf.d/intranet_proyectos.conf
nginx -t
systemctl reload nginx

echo "==> Comprobación rápida..."
for h in proyectos.odecopack.co 190.85.248.102 10.75.45.4; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: $h" "http://127.0.0.1/")
  echo "  Host=$h -> HTTP $code"
done
echo "Listo."
