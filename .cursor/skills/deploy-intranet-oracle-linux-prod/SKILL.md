---
name: deploy-intranet-oracle-linux-prod
description: >-
  Despliega intranet_proyectos (Django 2.2, Celery, Webpack, S3) en Oracle Linux 9.x
  vía SSH: prerequisitos de sistema, Python compatible, venv, build de assets,
  variables de entorno, migraciones, collectstatic, Gunicorn, Celery y Redis.
  Usar cuando el usuario pida producción, Oracle Linux, OL9, VM, servidor, SSH,
  despliegue, instalación, reinicio del servicio o arranque automático de esta intranet.
---

# Despliegue producción — intranet_proyectos (Oracle Linux 9.x, SSH)

## Rol del agente

1. **Leer** esta skill antes de ejecutar comandos.
2. **Conectar por SSH** al servidor (el usuario debe tener acceso; no inventar credenciales).
3. **Ejecutar o proponer** los pasos en orden; ante fallos, diagnosticar (logs `journalctl`, salida de `pip`, `npm`, `manage.py`).
4. **No commitear secretos** ni pegar claves en el chat; usar archivos en el servidor con permisos restrictivos (`chmod 600`) o gestor de secretos corporativo.

## Contexto del proyecto (imprescindible)

| Aspecto | Detalle |
|--------|---------|
| Framework | Django **2.2.x** (`DJANGO_CONFIGURATION=Production` en `intranet_proyectos/settings/__init__.py`) |
| App WSGI | `intranet_proyectos.wsgi:application` |
| Celery | `intranet_proyectos/celeryapp.py` usa por defecto `intranet_proyectos.settings.local` — **obligatorio** definir `DJANGO_SETTINGS_MODULE=intranet_proyectos.settings` y `DJANGO_CONFIGURATION=Production` en el entorno del worker (y de Gunicorn) para no ejecutar tareas contra settings locales |
| Broker Redis | En código, `CELERY_BROKER_URL` en `production.py` apunta a **ElastiCache AWS**; la VM debe tener **salida a ese host/puerto** o el equipo debe **parametrizar** el broker (ver [reference.md](reference.md)) |
| Resultados Celery | `CELERY_RESULT_BACKEND = 'django-db'` — requiere tablas en DB y paquete compatible (`django-celery-results` si aplica a la versión de Celery; **verificar** en el repo y migraciones) |
| Frontend | `npm run build_prod` genera bundles; producción usa `webpack-stats-prod.json` |
| Estáticos/media | **S3** (`django-storages` + `custom_storages.py`) — `collectstatic` sube a bucket; hace falta red + credenciales AWS |
| PDF | **WeasyPrint** — dependencias nativas (Cairo, Pango, etc.) |
| MySQL | `mysqlclient` — headers de desarrollo MariaDB/MySQL en el sistema |

## Compatibilidad Python (crítico en OL9)

Django 2.2 es compatible hasta **Python 3.8** (no usar 3.9+ sin actualizar Django). En Oracle Linux 9 el Python del sistema suele ser ≥3.9.

**Opciones:** instalar **Python 3.8** con `pyenv`, paquete RPM si existe en el entorno, o contenedor. Documentar en el despliegue qué binario usa el venv (`which python`, `python --version`).

## Checklist previo (antes de SSH)

- [ ] Host, usuario SSH, método de autenticación (clave / bastión).
- [ ] MySQL/MariaDB accesible desde la VM (host, puerto, usuario, BD).
- [ ] Redis/Celery: conectividad al broker configurado o decisión de cambiar URL.
- [ ] S3: bucket, región, claves IAM o rol/instance profile si la VM está en AWS.
- [ ] SMTP u otro backend de correo si se usa en producción.
- [ ] Dominio o IP detrás de **Nginx** (o reverse proxy) y TLS (certbot / balanceador).
- [ ] Token **Font Awesome Pro** si `npm install` lo exige (`.npmrc` en el servidor o CI).

## Paquetes de sistema sugeridos (Oracle Linux 9)

Instalar vía `dnf` (ajustar nombres si el mirror usa variantes):

- Compilación y MySQL: `gcc`, `python3-devel` o equivalente para la versión elegida, `mariadb-devel` o `mysql-devel`.
- WeasyPrint / Cairo: `cairo-devel`, `pango-devel`, `gdk-pixbuf2-devel`, `libffi-devel`, `shared-mime-info`, fuentes (`google-noto-sans-fonts` o corporativas).
- Opcional proxy/servidor web: `nginx`.
- Herramientas: `git`, `curl`, `tar`, `openssl`.

Redis **solo** si el broker es local; si sigue siendo ElastiCache, no hace falta daemon Redis en la VM.

## Flujo de despliegue por SSH (orden recomendado)

### 1) Usuario y directorio de la aplicación

Crear usuario de sistema dedicado (ej. `intranet`) y directorio de despliegue (ej. `/srv/intranet_proyectos`). Clonar o actualizar el código (`git pull` en tag/rama acordada).

### 2) Entorno Python

```bash
cd /srv/intranet_proyectos
python3.8 -m venv venv   # o la ruta del Python 3.8 elegido
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### 3) Variables de entorno

Cargar **antes** de cualquier comando Django/Celery. Lista mínima alineada con `intranet_proyectos/settings/production.py`:

- `DJANGO_CONFIGURATION=Production`
- `DJANGO_SETTINGS_MODULE=intranet_proyectos.settings` (requerido; si no se define, Celery cae en `settings.local` por `celeryapp.py`)
- `DJANGO_SECRET_KEY`
- `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME` (y región si se personaliza en boto)
- Admin: `ADMIN_NAME`, `ADMIN_EMAIL`
- Email: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `EMAIL_USE_TLS`, `EMAIL_USE_SSL`, `SERVER_EMAIL`, `DEFAULT_FROM_EMAIL`
- Opcional: `ENVIAR_SMS=on|off`

Plantilla extendida y notas: [reference.md](reference.md).

**Archivo:** por ejemplo `/etc/intranet_proyectos.env` con `0600`, propietario root o usuario de la app; referenciarlo en unidades `systemd` con `EnvironmentFile=`.

### 4) Frontend (build de producción)

Requiere **Node.js** (LTS compatible con Webpack 4 del proyecto, p. ej. Node 14/16 según pruebas).

```bash
cd /srv/intranet_proyectos
npm ci   # o npm install — resolver Font Awesome Pro antes
npm run build_prod
```

Comprobar que exista `webpack-stats-prod.json` y bundles bajo la ruta esperada por `WEBPACK_LOADER`.

### 5) Django: migraciones y estáticos

```bash
source /srv/intranet_proyectos/venv/bin/activate
set -a && source /etc/intranet_proyectos.env && set +a
cd /srv/intranet_proyectos
python manage.py migrate --noinput
python manage.py collectstatic --noinput
```

### 6) Gunicorn

Instalar `gunicorn` (si no está en `requirements.txt`, añadirlo al proyecto o instalarlo en el venv). Ejemplo de comando:

```bash
gunicorn intranet_proyectos.wsgi:application \
  --bind 127.0.0.1:8000 \
  --workers 3 \
  --timeout 120
```

En producción, **systemd** debe lanzar este proceso con `User=` de bajo privilegio y `WorkingDirectory=` al proyecto.

### 7) Celery worker (y beat si hay tareas periódicas)

Asegurar el mismo `EnvironmentFile` que Gunicorn. Comando típico:

```bash
celery -A intranet_proyectos.celeryapp worker -l info
```

Si existen tareas programadas en el código, añadir `celery beat` en unidad separada.

**Importante:** `celeryapp.py` hace `print('ENTROOOOO')` — conviene eliminarlo en una limpieza posterior (ruido en logs).

### 8) Nginx (u otro proxy)

Proxy reverso a `127.0.0.1:8000`, cabeceras `Host`/`X-Forwarded-Proto`, tamaño de cuerpo para uploads, timeouts alineados con Gunicorn. TLS fuera del alcance mínimo pero obligatorio en internet público.

### 9) SELinux y firewall

Si están activos: permitir que Nginx haga proxy, abrir 80/443, y que Python haga conexiones salientes a MySQL, Redis y AWS.

### 10) Post-despliegue

- `curl -I` local y detrás del dominio.
- Login admin y una vista que use estáticos S3.
- Tarea Celery de prueba (si hay cola disponible).
- `journalctl -u gunicorn-intranet -u celery-intranet -f`

## Ejecución remota desde máquina de administración

Patrón seguro (sustituir host y rutas):

```bash
ssh usuario@servidor-prod 'sudo -u intranet bash -lc "cd /srv/intranet_proyectos && source venv/bin/activate && set -a && source /etc/intranet_proyectos.env && set +a && python manage.py migrate --noinput"'
```

Para scripts largos, subir un `.sh` al servidor y ejecutarlo con `bash` en lugar de encadenar todo en una línea.

## Errores frecuentes

| Síntoma | Causa probable |
|--------|-----------------|
| `django.core.exceptions.ImproperlyConfigured` al arrancar | Falta `DJANGO_CONFIGURATION` o variables DB/AWS |
| Error import `MySQLdb` / build `mysqlclient` | Falta `mariadb-devel` o `gcc` |
| WeasyPrint falla al generar PDF | Faltan librerías Cairo/Pango o fuentes |
| `collectstatic` falla | Credenciales S3, red, o bucket incorrecto |
| Celery no procesa | Redis inaccesible, firewall, o URL de broker incorrecta |
| Assets 404 | No se ejecutó `build_prod` o stats de webpack desactualizados |

## Recursos adicionales

- Variables y unidades systemd de ejemplo: [reference.md](reference.md)
- Mantener esta skill acotada; cambios de código (parametrizar Redis, quitar prints) son PRs aparte.
