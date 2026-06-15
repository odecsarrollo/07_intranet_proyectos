# Implementación On-Prem — Intranet Proyectos (Odecopack)

Documentación del despliegue actual en Oracle Linux con **Podman**, **Nginx** y **Django OnPrem**.

**Servidor de referencia:** `/var/www/html/07_intranet_proyectos`  
**Dominio:** `http://proyectos.odecopack.co/` → IP `190.85.248.102`

---

## 1. Arquitectura general

```text
                    ┌─────────────────────────────────────────┐
  Usuarios (LAN)    │              Servidor host               │
  ───────────────►  │                                          │
  :80 HTTP          │  Nginx (:80)                             │
                    │    │ proxy /, /static/, /media/         │
                    │    ▼                                     │
                    │  Gunicorn (:8000) — contenedor web       │
                    │    │ WhiteNoise (/static/)               │
                    │    │ Django SERVE_MEDIA (/media/)        │
                    │    ├──► MariaDB (:3306) — contenedor db  │
                    │    └──► Redis (:6379) — contenedor redis│
                    │                                          │
                    │  Celery worker — tareas asíncronas       │
                    └─────────────────────────────────────────┘

  Persistencia en disco del host:
    ./media/         → uploads (PDF cotizaciones, imágenes, etc.)
    ./staticfiles/   → collectstatic (WhiteNoise)
  Volúmenes Podman:
    db_data, redis_data
```

### Flujo de una petición

| Ruta | Quién responde | Detalle |
|------|----------------|---------|
| `/`, `/app/*`, `/api/*` | Gunicorn → Django | App React + API REST (Knox token) |
| `/static/*` | Gunicorn → WhiteNoise | Bundles Webpack + CSS/JS recolectados |
| `/media/*` | Gunicorn → Django `SERVE_MEDIA` | Archivos subidos en `./media` (montado en `/app/media`) |
| `/admin/` | Gunicorn → Django Admin | Panel administración |

Nginx **no sirve archivos estáticos ni media desde disco**; hace **proxy** a `127.0.0.1:8000`. Esto evita errores **403** por SELinux (`container_file_t`) y permisos Unix tras cada `collectstatic` o reinicio de Podman.

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión / notas |
|------|------------|-----------------|
| Backend | Django | 2.2.6, Python 3.6 |
| WSGI | Gunicorn | 3 workers, timeout 120s |
| API auth | Django REST + Knox | Token en header |
| Frontend | React 16 + Webpack 4 | Build previo en PC de desarrollo |
| Estáticos | WhiteNoise | `CompressedStaticFilesStorage` |
| Async | Celery 4.4 + Redis 6 | Worker en contenedor aparte |
| BD | MariaDB 10.11 | Contenedor `db` |
| Contenedores | Podman + podman-compose | Oracle Linux |
| Reverse proxy | Nginx 1.20 | En el host (no en contenedor) |
| Config Django | `DJANGO_CONFIGURATION=OnPrem` | `intranet_proyectos/settings/onprem.py` |

---

## 3. Estructura en el servidor

```text
/var/www/html/07_intranet_proyectos/
├── .env                          # Variables de entorno (NO commitear)
├── podman-compose.yml            # Definición de servicios
├── intranet_proyectos.conf       # Plantilla Nginx (copiar a /etc/nginx/conf.d/)
├── Dockerfile.prebuilt           # Imagen backend sin Node
├── media/                        # Uploads persistentes (bind mount)
├── staticfiles/                  # Salida de collectstatic (bind mount)
├── static/assets/bundles/dist/   # Bundles Webpack (build en PC)
├── webpack-stats-prod.json       # Mapa de bundles para django-webpack-loader
├── deploy/
│   ├── docker-entrypoint.sh      # collectstatic + gunicorn al arrancar web
│   ├── apply-onprem-nginx.sh     # Instala config Nginx y recarga
│   ├── restart-web-allowed-hosts.sh
│   ├── fix-media-403.sh          # Corrige /media/ (proxy + recrear web)
│   └── fix-nginx-static-perms.sh # Permisos/SELinux si Nginx usa alias en disco
└── intranet_proyectos/
    └── settings/onprem.py        # Settings producción local
```

**Nginx instalado en el host:**

```text
/etc/nginx/conf.d/intranet_proyectos.conf   ← copia de intranet_proyectos.conf del repo
```

---

## 4. Servicios Podman (`podman-compose.yml`)

| Servicio | Imagen | Puertos expuestos | Rol |
|----------|--------|-------------------|-----|
| `db` | `mariadb:10.11` | `0.0.0.0:3306` | Base de datos |
| `redis` | `redis:6-alpine` | *(solo red interna)* | Broker Celery |
| `web` | build `Dockerfile.prebuilt` | `0.0.0.0:8000` | Django + Gunicorn |
| `worker` | build `Dockerfile.prebuilt` | — | Celery worker |

### Volúmenes del contenedor `web`

```yaml
./media:/app/media:U,z
./staticfiles:/app/staticfiles:U,z
```

- `:U` — Podman ajusta propietario del directorio en el host.
- `:z` — Etiqueta SELinux compartida (necesaria con volúmenes bind).

### Arranque del contenedor `web` (`deploy/docker-entrypoint.sh`)

1. `python manage.py collectstatic --noinput`
2. `chmod -R a+rX` en `STATIC_ROOT` y `MEDIA_ROOT`
3. `gunicorn ... --bind 0.0.0.0:8000 --workers 3`

---

## 5. Variables de entorno (`.env`)

Archivo en la raíz del repo. **No subir a Git.**

```dotenv
# Django
DJANGO_CONFIGURATION=OnPrem
DJANGO_SETTINGS_MODULE=intranet_proyectos.settings
DJANGO_SECRET_KEY=<clave-larga-secreta>
ALLOWED_HOSTS=proyectos.odecopack.co,www.proyectos.odecopack.co,190.85.248.102,190.90.52.254,10.75.45.4,localhost,127.0.0.1,odecopack-app

# Rutas dentro del contenedor
MEDIA_ROOT=/app/media
STATIC_ROOT=/app/staticfiles

# Base de datos (host = nombre del servicio en compose)
DB_ENGINE=django.db.backends.mysql
DB_NAME=proyectos_intranet
DB_USER=proyectos
DB_PASSWORD=<password>
DB_ROOT_PASSWORD=<password-root>
DB_HOST=db
DB_PORT=3306
DB_HOST_REPLICA=db

# Celery
CELERY_BROKER_URL=redis://redis:6379/0

# Email (opcional; requiere salida SMTP permitida en firewall)
EMAIL_HOST=<smtp-interno-o-relay>
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_PORT=465
EMAIL_USE_SSL=True
EMAIL_USE_TLS=False
SERVER_EMAIL=
DEFAULT_FROM_EMAIL=
ADMIN_NAME=
ADMIN_EMAIL=
```

### `ALLOWED_HOSTS`

Django rechaza con **400 Bad Request** cualquier petición cuyo header `Host` no esté en esta lista. Tras cambiar `.env`, **recrear el contenedor web**:

```bash
sudo ./deploy/restart-web-allowed-hosts.sh
```

---

## 6. Configuración Nginx

Archivo fuente: `intranet_proyectos.conf`

```nginx
server {
    listen 80;
    server_name proyectos.odecopack.co www.proyectos.odecopack.co 190.85.248.102 190.90.52.254 10.75.45.4;
    client_max_body_size 50m;

    location /static/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
    }
    location /media/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
    }
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
    }
}
```

### Instalar / actualizar Nginx

```bash
cd /var/www/html/07_intranet_proyectos
sudo ./deploy/apply-onprem-nginx.sh
```

Equivale a:

```bash
sudo install -m 0640 -o root -g nginx intranet_proyectos.conf /etc/nginx/conf.d/intranet_proyectos.conf
sudo nginx -t
sudo systemctl reload nginx
```

### HTTPS (opcional, futuro)

- Terminar TLS en Nginx (`listen 443 ssl`).
- Abrir puerto **443** en firewall.
- Considerar `SECURE_PROXY_SSL_HEADER` en Django si hay proxy externo.

---

## 7. Django OnPrem — estáticos y media

### Settings (`intranet_proyectos/settings/onprem.py`)

- `DEBUG = False`
- `WhiteNoiseMiddleware` activo
- `SERVE_MEDIA = True` — Django sirve `/media/` en producción on-prem
- `STATIC_ROOT` / `MEDIA_ROOT` desde variables de entorno
- Sin S3; todo en disco local

### URLs (`intranet_proyectos/urls.py`)

Ruta de media registrada **al inicio** de `urlpatterns` cuando `SERVE_MEDIA=True`:

```python
re_path(r"^media/(?P<path>.*)$", media_serve, {"document_root": settings.MEDIA_ROOT})
```

---

## 8. Firewall y red (servidor sin Internet abierto)

### Entrada (usuarios)

| Puerto | Servicio | ¿Abrir? |
|--------|----------|---------|
| **80** | HTTP (Nginx) | **Sí** — acceso intranet |
| **443** | HTTPS | Recomendado cuando haya certificado |

### No exponer a usuarios finales

| Puerto | Motivo |
|--------|--------|
| **8000** | Gunicorn; Nginx ya hace de fachada. Ideal bind `127.0.0.1:8000` |
| **3306** | MariaDB; solo admins/backup, IPs restringidas |
| **6379** | Redis; solo red interna Podman |

### Salida (egress)

- **No obligatoria** para uso web normal.
- **SMTP (465/587):** solo si se envían correos; usar relay SMTP **interno** si no hay Internet.
- **DNS interno:** para resolver `proyectos.odecopack.co`.

Ejemplo firewalld:

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload
```

---

## 9. Despliegue inicial

### En PC de desarrollo (con Node)

```bash
npm ci
npm run build_prod
```

Verificar:

- `static/assets/bundles/dist/*`
- `webpack-stats-prod.json`

### En el servidor

```bash
cd /var/www/html/07_intranet_proyectos
mkdir -p media staticfiles

# Crear .env (ver sección 4)
cp .env.example .env   # si existe plantilla; si no, crear manualmente
nano .env

# Levantar stack
podman-compose build
podman-compose up -d

# Migraciones (una vez)
podman-compose exec web python manage.py migrate --noinput
podman-compose exec web python manage.py createcachetable
podman-compose exec web python manage.py createinitialrevisions

# Nginx
sudo ./deploy/apply-onprem-nginx.sh
```

---

## 10. Operación diaria

### Ver estado

```bash
podman-compose ps
podman-compose logs -f web
podman-compose logs -f worker
```

### Reiniciar solo la app web

```bash
podman-compose restart web
```

### Tras cambiar `.env` o `ALLOWED_HOSTS`

```bash
sudo ./deploy/restart-web-allowed-hosts.sh
```

### Tras cambiar código Python o frontend

```bash
# Si cambió el frontend: rebuild en PC y subir dist/ + webpack-stats-prod.json
podman-compose up -d --build --force-recreate web worker
```

### Backup mínimo

```bash
# Base de datos
podman-compose exec db mariadb-dump -u root -p"$DB_ROOT_PASSWORD" proyectos_intranet > backup_$(date +%F).sql

# Media
tar czf media_backup_$(date +%F).tar.gz media/
```

---

## 11. Scripts de mantenimiento (`deploy/`)

| Script | Uso |
|--------|-----|
| `apply-onprem-nginx.sh` | Instala `intranet_proyectos.conf` y recarga Nginx |
| `restart-web-allowed-hosts.sh` | Recrea contenedor web + Nginx; corrige error **400** por dominio |
| `fix-media-403.sh` | Proxy `/media/` + recrear web; corrige **403/404** en PDFs e imágenes |
| `fix-nginx-static-perms.sh` | Permisos Unix + SELinux en `./media` y `./staticfiles` (solo si Nginx usa `alias`) |
| `docker-entrypoint.sh` | Usado dentro de la imagen; no ejecutar a mano en el host |

---

## 12. Solución de problemas

### Error 400 Bad Request

**Causa:** el `Host` de la petición no está en `ALLOWED_HOSTS` del contenedor en ejecución.

**Solución:**

1. Añadir dominio/IP en `.env` → `ALLOWED_HOSTS`
2. Añadir dominio en `server_name` de `intranet_proyectos.conf`
3. `sudo ./deploy/restart-web-allowed-hosts.sh`

### Error 403 en `/static/` o `/media/`

**Causa habitual:** Nginx intentando leer disco con SELinux `container_file_t` o permisos `root:root`.

**Solución recomendada:** proxy a Gunicorn (config actual) + `sudo ./deploy/fix-media-403.sh`

**Alternativa:** `sudo ./deploy/fix-nginx-static-perms.sh` si se usa `alias` en Nginx.

### Error 404 en `/media/...pdf`

**Causa:** archivo no existe en `./media/...` **o** contenedor web sin volumen montado (`/app/media` vacío).

**Comprobar:**

```bash
ls -la media/documentos/cotizaciones/4185/
podman-compose exec web ls -la /app/media/documentos/cotizaciones/4185/
```

**Solución:** `sudo ./deploy/fix-media-403.sh`

### Estáticos desactualizados

**Causa:** falta rebuild frontend o `collectstatic` no corrió.

**Solución:** subir nuevo `dist/` + `podman-compose up -d --force-recreate web`

### Celery no procesa tareas

```bash
podman-compose logs -f worker
podman-compose ps   # worker debe estar Up
```

---

## 13. DNS y acceso por dominio

| Registro | Valor |
|----------|-------|
| `proyectos.odecopack.co` | A → `190.85.248.102` |
| `www.proyectos.odecopack.co` | CNAME → `proyectos.odecopack.co` (opcional) |

Acceso:

- `http://proyectos.odecopack.co/`
- `http://190.85.248.102/` (IP directa, también en `ALLOWED_HOSTS`)

---

## 14. Diferencias con despliegue AWS (cloud)

| Aspecto | On-Prem | AWS (Production) |
|---------|---------|------------------|
| Settings | `OnPrem` | `Production` |
| Estáticos | WhiteNoise + disco | S3 |
| Media | Disco local `./media` | S3 |
| BD | MariaDB contenedor | RDS |
| Celery | Redis contenedor | ElastiCache |
| Nginx | Host Oracle Linux | Elastic Beanstalk / ALB |

---

## 15. Contacto / referencias internas

- Guía general del repo: `CLAUDE.md`
- Despliegue cloud: `DEPLOYMENT.md`, `cloud.md`
- Configuración activa Nginx: `intranet_proyectos.conf`
- Compose: `podman-compose.yml`

---

*Última actualización: refleja implementación con dominio `proyectos.odecopack.co`, proxy Nginx → Gunicorn para `/static/` y `/media/`, y `SERVE_MEDIA=True` en OnPrem.*
