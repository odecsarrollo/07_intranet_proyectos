# Referencia — despliegue intranet_proyectos (OL9)

## Archivo de entorno (`/etc/intranet_proyectos.env`)

Valores son ilustrativos; sustituir por secretos reales. Sin comillas en valores simples salvo que el shell lo requiera.

```bash
DJANGO_CONFIGURATION=Production
DJANGO_SETTINGS_MODULE=intranet_proyectos.settings
DJANGO_SECRET_KEY=cambiar-por-clave-larga-y-aleatoria

DB_ENGINE=django.db.backends.mysql
DB_NAME=proyectos_intranet
DB_USER=app_user
DB_PASSWORD=***
DB_HOST=mysql.ejemplo.internal
DB_PORT=3306

AWS_ACCESS_KEY=***
AWS_SECRET_ACCESS_KEY=***
S3_BUCKET_NAME=nombre-bucket

ADMIN_NAME=Equipo
ADMIN_EMAIL=infra@empresa.com

EMAIL_HOST=smtp.ejemplo.com
EMAIL_PORT=587
EMAIL_HOST_USER=***
EMAIL_HOST_PASSWORD=***
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
SERVER_EMAIL=noreply@empresa.com
DEFAULT_FROM_EMAIL=noreply@empresa.com

# Opcional
# ENVIAR_SMS=off
```

### Celery y Redis

En `production.py` la URL del broker Redis puede estar **fija** (ElastiCache). Para usar otro Redis sin cambiar código, el proyecto debería leer `CELERY_BROKER_URL` desde el entorno; mientras no sea así, la VM debe poder alcanzar el host:puerto definidos en código.

Si se añade soporte por variable de entorno, el archivo podría incluir:

```bash
# CELERY_BROKER_URL=redis://127.0.0.1:6379/0
```

## Unidad systemd — Gunicorn

`/etc/systemd/system/gunicorn-intranet.service` (ajustar rutas y usuario):

```ini
[Unit]
Description=Gunicorn intranet_proyectos
After=network.target

[Service]
User=intranet
Group=intranet
WorkingDirectory=/srv/intranet_proyectos
EnvironmentFile=/etc/intranet_proyectos.env
ExecStart=/srv/intranet_proyectos/venv/bin/gunicorn intranet_proyectos.wsgi:application \
  --bind 127.0.0.1:8000 --workers 3 --timeout 120
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## Unidad systemd — Celery worker

`/etc/systemd/system/celery-intranet.service`:

```ini
[Unit]
Description=Celery worker intranet_proyectos
After=network.target

[Service]
User=intranet
Group=intranet
WorkingDirectory=/srv/intranet_proyectos
EnvironmentFile=/etc/intranet_proyectos.env
ExecStart=/srv/intranet_proyectos/venv/bin/celery -A intranet_proyectos.celeryapp worker -l info
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Tras crear o editar unidades:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now gunicorn-intranet celery-intranet
```

## Fragmento Nginx (referencia)

```nginx
server {
    listen 80;
    server_name intranet.ejemplo.com;

    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
```

TLS: usar `listen 443 ssl` + certificados o delegar TLS en un balanceador corporativo.

## django-celery-results

Si `CELERY_RESULT_BACKEND = 'django-db'` y faltan tablas o el paquete, alinear versión de `django-celery-results` con Celery 5.x y Django 2.2, añadir a `INSTALLED_APPS` y ejecutar migraciones del paquete. Si el equipo prefiere evitar DB para resultados, puede valorar `redis://...` como backend de resultados (cambio de configuración).
