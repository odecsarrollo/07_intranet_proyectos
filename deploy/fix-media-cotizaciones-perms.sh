#!/usr/bin/env bash
# Permisos de escritura para PDFs nuevos en cotizaciones ventas_componentes.
# Uso: sudo ./deploy/fix-media-cotizaciones-perms.sh
set -euo pipefail

SITE_ROOT="${SITE_ROOT:-/var/www/html/07_intranet_proyectos}"
VC_DIR="${SITE_ROOT}/media/cotizaciones/ventas_componentes"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Ejecuta con sudo: sudo $0" >&2
  exit 1
fi

mkdir -p "$VC_DIR"
chmod 2777 "$VC_DIR"
chmod -R a+rwX "$VC_DIR"

echo "OK: $VC_DIR (escritura para contenedor web / Gunicorn)"
echo "Recrea el contenedor: cd $SITE_ROOT && podman-compose up -d --build --force-recreate web"
