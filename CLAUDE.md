# Contexto del proyecto (para Claude)

## Qué es este repo

- **Aplicación**: Intranet Proyectos (Odecopack)
- **Backend**: Django `2.2.6` (Python `3.6`), WSGI `intranet_proyectos/wsgi.py`
- **API**: Django REST Framework + **Knox** (auth por token)
- **Frontend**: React `16` + Webpack `4` (bundles en `static/assets/bundles/dist/` + `webpack-stats-prod.json`)
- **Async**: Celery `4.4.x` + Redis
- **DB**: MySQL/MariaDB (en on-prem se usa MariaDB container)
- **Static files on-prem**: WhiteNoise (se hace `collectstatic` al arrancar el contenedor)

Entrypoints relevantes:

- `manage.py`
- `intranet_proyectos/settings/__init__.py` elige settings por `DJANGO_CONFIGURATION`:
  - `Local` → `intranet_proyectos/settings/local.py`
  - `Production` → `intranet_proyectos/settings/production.py` (AWS/S3)
  - `OnPrem` → `intranet_proyectos/settings/onprem.py` (sin S3, WhiteNoise)
- `deploy/docker-entrypoint.sh`: `collectstatic` y arranca Gunicorn en `:8000`

## Comandos típicos (desarrollo)

### Backend (Windows)

> Nota: este repo está fijado a Python 3.6/Django 2.2. Si estás en Python moderno, usa contenedor o un venv compatible.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:DJANGO_CONFIGURATION="Local"
python manage.py migrate
python manage.py runserver
```

### Frontend (build)

```bash
npm ci
npm run build_prod
```

Artefactos esperados para producción/on-prem:

- `static/assets/bundles/dist/*`
- `webpack-stats-prod.json`

## Deploy Cloud (AWS Elastic Beanstalk)

La guía existente está en:

- `DEPLOYMENT.md`
- `cloud.md`

Puntos clave:

- `DJANGO_CONFIGURATION=Production`
- `collectstatic` en cloud sube a S3 vía `custom_storages.py`

### Resumen operativo (paso a paso)

**Objetivo**: desplegar a Elastic Beanstalk (plataforma Python 3.6) usando `.ebextensions/`.

#### 0) Preparación local (obligatoria)

Compilar frontend antes de desplegar:

```bash
npm ci
npm run build_prod
```

Esto actualiza:

- `static/assets/bundles/dist/*`
- `webpack-stats-prod.json`

#### 1) Configuración EB (lo que hace este repo)

En `.ebextensions/` se configura:

- `DJANGO_SETTINGS_MODULE=intranet_proyectos.settings`
- `WSGIPath=intranet_proyectos/wsgi.py`
- instalación de paquetes del sistema (librerías para Pillow/WeasyPrint, compilación, etc.)
- comandos Django durante el deploy:
  - `python manage.py migrate --noinput` (leader only)
  - `python manage.py collectstatic --noinput` (leader only, sube a S3 en `Production`)
  - `python manage.py createcachetable` (leader only)
  - `python manage.py createinitialrevisions` (leader only)

#### 2) Variables de entorno mínimas (EB)

```bash
DJANGO_CONFIGURATION=Production
DJANGO_SECRET_KEY=<secret>
DB_ENGINE=django.db.backends.mysql
DB_NAME=<db-name>
DB_USER=<db-user>
DB_PASSWORD=<db-password>
DB_HOST=<rds-endpoint>
DB_PORT=3306
S3_BUCKET_NAME=<bucket>
AWS_ACCESS_KEY=<key>
AWS_SECRET_ACCESS_KEY=<secret>
EMAIL_HOST=<smtp-host>
EMAIL_HOST_USER=<smtp-user>
EMAIL_HOST_PASSWORD=<smtp-pass>
EMAIL_PORT=587
EMAIL_USE_TLS=True|False
EMAIL_USE_SSL=True|False
SERVER_EMAIL=<server-email>
DEFAULT_FROM_EMAIL=<from-email>
ADMIN_NAME=<admin-name>
ADMIN_EMAIL=<admin-email>
```

Notas:

- En `Production`, `DB_HOST_REPLICA` se fuerza temporalmente igual a `DB_HOST` (ver `intranet_proyectos/settings/production.py`).
- `CELERY_BROKER_URL` en `production.py` apunta a Redis (ElastiCache) y el result backend en cloud es `django-db`.

#### 3) Deploy (EB CLI)

Ejemplo (si usas EB CLI):

```bash
eb init -p python-3.6 intranet-proyectos --region us-west-2
eb create intranet-proyectos-prod
eb setenv DJANGO_CONFIGURATION=Production DJANGO_SECRET_KEY=... DB_ENGINE=... DB_NAME=... DB_USER=... DB_PASSWORD=... DB_HOST=... DB_PORT=3306 S3_BUCKET_NAME=... AWS_ACCESS_KEY=... AWS_SECRET_ACCESS_KEY=...
eb deploy
```

Verificación:

```bash
eb status
eb logs
eb open
```

#### 4) Celery en cloud

Elastic Beanstalk despliega el **web** (WSGI), pero los **workers de Celery** deben correr aparte (systemd/supervisor/otra instancia/otro servicio).

Comando típico:

```bash
celery -A intranet_proyectos.celeryapp worker --loglevel=info
```

## Deploy On-Prem en Oracle Linux (recomendado: Podman + podman-compose)

Este repo ya trae `podman-compose.yml` preparado para Oracle Linux.

### Suposiciones

- Oracle Linux con acceso a internet (para descargar imágenes)
- Dominio opcional (si no hay, funciona por IP/LAN)
- Se desplegará como **stack local**: `web` + `worker` + `redis` + `db`

### 0) Preparar el código en tu PC (build frontend)

La imagen **prebuilt** no instala Node ni compila Webpack. Debes compilar el frontend antes y subir los artefactos.

```bash
npm ci
npm run build_prod
```

Verifica que existan:

- `static/assets/bundles/dist/`
- `webpack-stats-prod.json`

Luego sube el repo al servidor (por `git clone`, `rsync`, etc.) incluyendo esos artefactos.

### 1) Instalar Podman y podman-compose (Oracle Linux)

Ejemplo (ajusta al repositorio disponible en tu OL):

```bash
sudo dnf -y update
sudo dnf -y install podman
```

Para `podman-compose`, dependiendo de tu OL:

- si existe paquete:

```bash
sudo dnf -y install podman-compose
```

- si no existe, usa `pip` del sistema (mejor en venv) o el wrapper recomendado por tu distro.

### 2) Crear `.env` (obligatorio)

`podman-compose.yml` referencia un archivo `.env` **en la raíz del repo**.

Crea `.env` con mínimo:

```dotenv
# Django
DJANGO_SECRET_KEY=pon-un-secret-largo
ALLOWED_HOSTS=localhost,127.0.0.1,tu-dominio-o-ip

# DB (on-prem: MariaDB container)
DB_ENGINE=django.db.backends.mysql
DB_NAME=proyectos_intranet
DB_USER=proyectos
DB_PASSWORD=proyectos
DB_ROOT_PASSWORD=root

# Email (si aplica)
EMAIL_HOST=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_PORT=587
EMAIL_USE_TLS=False
EMAIL_USE_SSL=False
SERVER_EMAIL=
DEFAULT_FROM_EMAIL=
ADMIN_NAME=
ADMIN_EMAIL=
```

Notas:

- En OnPrem, `DJANGO_CONFIGURATION` lo define `podman-compose.yml` como `OnPrem`.
- `ALLOWED_HOSTS` se parsea como lista por comas en `intranet_proyectos/settings/onprem.py`.
- `STATIC_ROOT`/`MEDIA_ROOT` se pueden sobreescribir por env si lo necesitas.

### 3) Crear directorios persistentes en el host

Desde la raíz del repo en el servidor:

```bash
mkdir -p media staticfiles
```

Se montan en el contenedor (ver `podman-compose.yml`) para persistir media y estáticos recolectados.

### 4) Construir y levantar servicios

Desde la raíz del repo:

```bash
podman-compose build
podman-compose up -d
```

Puertos expuestos por defecto:

- `8000/tcp` (Django/Gunicorn)
- `3306/tcp` (MariaDB) — expuesto a LAN en `podman-compose.yml` (restringe en firewall)

### 5) Migraciones y comandos one-off

La imagen ejecuta `collectstatic` al arrancar `web`, pero **no** ejecuta migraciones automáticamente.

Ejecuta migraciones (una vez):

```bash
podman-compose exec web python manage.py migrate --noinput
```

Otros comandos útiles:

```bash
podman-compose exec web python manage.py createsuperuser
podman-compose exec web python manage.py createcachetable
podman-compose exec web python manage.py createinitialrevisions
```

### 6) Firewall (Oracle Linux)

Si usarás acceso por LAN:

- abrir 8000 (o preferible, poner Nginx al frente y abrir 80/443)
- si **realmente** necesitas exponer DB, restringe 3306 a IP/subred

Ejemplo con `firewalld`:

```bash
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --reload
```

### 7) (Opcional) Nginx como reverse proxy (recomendado)

Recomendación:

- Nginx escucha `80/443`
- proxy a `127.0.0.1:8000`
- termina TLS (LetsEncrypt o certificado interno)

Configuración mínima de `location /` con headers `X-Forwarded-*` (y considerar `SECURE_PROXY_SSL_HEADER` si aplicara).

### 8) Arranque automático (systemd)

En servidores on-prem es recomendable un servicio systemd que haga `podman-compose up -d` al boot.

Enfoque simple:

- crear un unit que ejecute en `WorkingDirectory=<ruta-repo>`:
  - `podman-compose up -d`
  - `podman-compose down` en stop

### 9) Observabilidad / logs

```bash
podman-compose logs -f web
podman-compose logs -f worker
podman-compose ps
```

### 10) Backups (mínimo viable)

- **DB**: dump programado (cron) desde el contenedor `db` o desde el host:

```bash
podman-compose exec db mariadb-dump -u root -p"$DB_ROOT_PASSWORD" "$DB_NAME" > backup.sql
```

- **media/**: respaldar el directorio `./media` del host (rsync/tar)

## Puntos delicados / gotchas

- **Python/Django legacy**: Django 2.2 + Python 3.6. Evitar upgrades “por partes” sin plan.
- **Build frontend**: `Dockerfile.prebuilt` falla si no existen `static/assets/bundles/dist` y `webpack-stats-prod.json`.
- **Oracle Linux y nombres de imágenes**: `podman-compose.yml` fuerza `docker.io/...` porque nombres cortos pueden resolver a registries de Oracle y pedir login.
- **Secrets**: no commitear `.env` ni credenciales. En `Local` se usa `secretsLocal.json` (no versionado).

