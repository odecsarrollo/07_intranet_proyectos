#!/bin/sh
set -e
cd /app
# Junta estáticos (incluye bundles Webpack en static/assets/...) hacia STATIC_ROOT para WhiteNoise
python manage.py collectstatic --noinput
# Lectura en el host (backups, rsync, fix-nginx-static-perms si algún alias vuelve a usarse).
for _dir in "${STATIC_ROOT:-/app/staticfiles}" "${MEDIA_ROOT:-/app/media}"; do
  if [ -d "$_dir" ]; then
    chmod -R a+rX "$_dir" 2>/dev/null || true
  fi
done
# Escritura para nuevos PDFs de cotizaciones (Podman rootless mapea UID distinto de root en el host).
_vc="${MEDIA_ROOT:-/app/media}/cotizaciones/ventas_componentes"
if [ -d "$_vc" ]; then
  chmod -R a+rwX "$_vc" 2>/dev/null || true
fi
exec gunicorn intranet_proyectos.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
