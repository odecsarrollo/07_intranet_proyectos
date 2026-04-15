#!/bin/sh
set -e
cd /app
# Junta estáticos (incluye bundles Webpack en static/assets/...) hacia STATIC_ROOT para WhiteNoise
python manage.py collectstatic --noinput
exec gunicorn intranet_proyectos.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
