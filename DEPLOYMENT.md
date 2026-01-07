# Documentación de Deployment - Intranet Proyectos

## Resumen

Este proyecto se despliega en **AWS Elastic Beanstalk** utilizando la plataforma Python 3.6. El proceso de deployment es automatizado mediante archivos de configuración en `.ebextensions/` que ejecutan comandos durante el despliegue.

## Plataforma de Deployment

- **Servicio**: AWS Elastic Beanstalk
- **Plataforma**: Python 3.6
- **Región**: us-west-2 (según configuración de S3)
- **WSGI Path**: `intranet_proyectos/wsgi.py`

## Estructura de Archivos de Deployment

```
.ebextensions/
├── 01_awsbean.config      # Configuración básica de Elastic Beanstalk
├── 02_packages.config     # Paquetes del sistema a instalar
└── 03_python.config       # Comandos de Django a ejecutar durante deployment
```

## Proceso de Deployment Detallado

### 1. Configuración Básica (01_awsbean.config)

```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    DJANGO_SETTINGS_MODULE: intranet_proyectos.settings
  aws:elasticbeanstalk:container:python:
    WSGIPath: intranet_proyectos/wsgi.py
```

**Propósito**:

- Define el módulo de settings de Django a usar
- Especifica la ruta del archivo WSGI para la aplicación

### 2. Instalación de Paquetes del Sistema (02_packages.config)

```yaml
packages:
  yum:
    git: []
    libjpeg-turbo-devel: []
    libpng-devel: []
    freetype-devel: []
    gcc-c++: []
    python34-devel: []
    postgresql93-devel: []
    libffi-devel: []
    cairo: []
    pango: []
```

**Propósito**: Instala dependencias del sistema necesarias para:

- Compilación de paquetes Python nativos
- Procesamiento de imágenes (Pillow, WeasyPrint)
- Librerías gráficas (Cairo, Pango) para generación de PDFs
- Desarrollo Python (python34-devel)

**Nota**: Aunque el proyecto usa MySQL, se instala `postgresql93-devel` (posiblemente para compatibilidad con otras dependencias).

### 3. Comandos de Django (03_python.config)

Los comandos se ejecutan en orden durante el deployment:

#### 3.1. Migraciones de Base de Datos

```yaml
01_migrate:
  command: python manage.py migrate --noinput
  leader_only: true
```

- **Propósito**: Aplica todas las migraciones pendientes
- **leader_only**: Solo se ejecuta en la instancia líder (evita ejecuciones duplicadas en entornos con múltiples instancias)

#### 3.2. Creación de Superusuario

```yaml
02_createsu:
  command: python manage.py makesuper
```

- **Propósito**: Crea un superusuario por defecto si no existe
- **Comando personalizado**: `index/management/commands/makesuper.py`
- **Detalles**: Crea usuario "admin" con email "fabio.garcia.sanchez@gmail.com" y password "1234567890"
- **⚠️ ADVERTENCIA**: Este comando debería ser `leader_only: true` y la contraseña debería estar en variables de entorno

#### 3.3. Recolección de Archivos Estáticos

```yaml
03_collectstatic:
  command: python manage.py collectstatic --noinput
  leader_only: true
```

- **Propósito**: Recolecta todos los archivos estáticos y los sube a S3
- **Storage**: Usa `custom_storages.StaticStorage` que sube a S3
- **Ubicación**: `{S3_BUCKET}/static/`

#### 3.4. Creación de Tabla de Cache

```yaml
04_createcachetable:
  command: python manage.py createcachetable
  leader_only: true
```

- **Propósito**: Crea la tabla de cache en la base de datos
- **Backend**: Django usa cache en base de datos para sesiones y cache de queries

#### 3.5. Configuración WSGI

```yaml
05_wsgipass:
  command: 'echo "WSGIPassAuthorization On" >> ../wsgi.conf'
  leader_only: true
```

- **Propósito**: Habilita el paso de headers de autorización a través de WSGI
- **Razón**: Necesario para autenticación con tokens (Django REST Knox)

#### 3.6. Revisiones Iniciales (django-reversion)

```yaml
06_createinitialrevisions:
  command: python manage.py createinitialrevisions
  leader_only: true
```

- **Propósito**: Crea revisiones iniciales para todos los modelos que usan django-reversion
- **Librería**: django-reversion (control de versiones de modelos)

#### 3.7. Instalación de Dependencias Python

```yaml
07_requirements:
  command: 'source /opt/python/run/venv/bin/activate && pip install -r requirements.txt'
  leader_only: false
```

- **Propósito**: Instala todas las dependencias Python desde `requirements.txt`
- **Virtual Environment**: Activa el venv de Elastic Beanstalk
- **leader_only: false**: Se ejecuta en todas las instancias (necesario para que todas tengan las dependencias)

## Proceso de Build del Frontend

### Antes del Deployment

El frontend React debe ser compilado antes del deployment:

```bash
npm run build_prod
```

Este comando ejecuta:

```bash
./node_modules/.bin/webpack --config webpack.prod.config.js
```

### Configuración de Webpack para Producción

**Archivo**: `webpack.prod.config.js`

**Características**:

- **Output**: `./static/assets/bundles/dist/`
- **Filename**: `[name]-[hash].js` (con hash para cache busting)
- **Mode**: `production`
- **Source Maps**: Habilitados (`source-map`)
- **Optimizaciones**:
  - TerserPlugin para minificación de JS
  - OptimizeCSSAssetsPlugin para minificación de CSS
  - MiniCssExtractPlugin para extraer CSS en archivos separados
  - BundleTracker genera `webpack-stats-prod.json`

**Archivo generado**: `webpack-stats-prod.json` (usado por django-webpack-loader)

## Variables de Entorno Requeridas

El deployment requiere las siguientes variables de entorno configuradas en Elastic Beanstalk:

### Configuración Django

```bash
DJANGO_CONFIGURATION=Production
DJANGO_SECRET_KEY=<secret-key>
```

### Base de Datos

```bash
DB_ENGINE=django.db.backends.mysql
DB_NAME=<database-name>
DB_USER=<database-user>
DB_PASSWORD=<database-password>
DB_HOST=<rds-endpoint>
DB_HOST_REPLICA=<rds-replica-endpoint>
DB_PORT=3306
```

### AWS S3

```bash
S3_BUCKET_NAME=<bucket-name>
AWS_ACCESS_KEY=<aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<aws-secret-access-key>
```

### Email

```bash
EMAIL_HOST=<smtp-host>
EMAIL_HOST_USER=<smtp-user>
EMAIL_HOST_PASSWORD=<smtp-password>
EMAIL_PORT=<smtp-port>
EMAIL_USE_TLS=True|False
EMAIL_USE_SSL=True|False
SERVER_EMAIL=<server-email>
DEFAULT_FROM_EMAIL=<from-email>
```

### Administración

```bash
ADMIN_NAME=<admin-name>
ADMIN_EMAIL=<admin-email>
```

## Flujo Completo de Deployment

### Paso 1: Preparación Local

1. **Build del Frontend**:

   ```bash
   npm install
   npm run build_prod
   ```

   Esto genera:

   - Archivos JS/CSS minificados en `static/assets/bundles/dist/`
   - `webpack-stats-prod.json`

2. **Verificar cambios**:
   ```bash
   git status
   git add .
   git commit -m "Preparar deployment"
   ```

### Paso 2: Deployment a Elastic Beanstalk

#### Opción A: Usando EB CLI

```bash
# Inicializar (solo primera vez)
eb init -p python-3.6 intranet-proyectos --region us-west-2

# Crear entorno (solo primera vez)
eb create intranet-proyectos-prod

# Configurar variables de entorno
eb setenv \
  DJANGO_CONFIGURATION=Production \
  DJANGO_SECRET_KEY=<secret> \
  DB_ENGINE=django.db.backends.mysql \
  DB_NAME=<db-name> \
  DB_USER=<db-user> \
  DB_PASSWORD=<db-password> \
  DB_HOST=<rds-endpoint> \
  DB_HOST_REPLICA=<rds-replica-endpoint> \
  S3_BUCKET_NAME=<bucket-name> \
  AWS_ACCESS_KEY=<access-key> \
  AWS_SECRET_ACCESS_KEY=<secret-key> \
  EMAIL_HOST=<smtp-host> \
  EMAIL_HOST_USER=<smtp-user> \
  EMAIL_HOST_PASSWORD=<smtp-password> \
  EMAIL_PORT=587 \
  EMAIL_USE_TLS=True \
  ADMIN_NAME=<admin-name> \
  ADMIN_EMAIL=<admin-email>

# Deploy
eb deploy
```

#### Opción B: Usando AWS Console

1. Crear un ZIP del proyecto (incluyendo `.ebextensions/`)
2. Subir a Elastic Beanstalk mediante la consola
3. Configurar variables de entorno en la consola

### Paso 3: Proceso Automático en Elastic Beanstalk

Cuando se despliega, Elastic Beanstalk ejecuta automáticamente:

1. **Instalación de paquetes del sistema** (02_packages.config)
2. **Creación/activación del entorno virtual Python**
3. **Instalación de dependencias** (07_requirements)
4. **Ejecución de comandos Django** (en orden):
   - Migraciones (01_migrate)
   - Crear superusuario (02_createsu)
   - Collectstatic (03_collectstatic) → Sube a S3
   - Crear tabla de cache (04_createcachetable)
   - Configurar WSGI (05_wsgipass)
   - Crear revisiones iniciales (06_createinitialrevisions)
5. **Inicio de la aplicación WSGI**

### Paso 4: Verificación

```bash
# Ver logs
eb logs

# Ver estado
eb status

# Abrir en navegador
eb open

# SSH al servidor
eb ssh
```

## Servicios Adicionales en Deployment

### Celery Workers

Los workers de Celery deben ejecutarse por separado. No están incluidos en el deployment de Elastic Beanstalk.

**Configuración**:

- **Broker**: Redis (ElastiCache)
- **Endpoint**: `odecoredis.hiw7zx.0001.usw2.cache.amazonaws.com:6379`
- **Backend**: `django-db` (resultados en base de datos)

**Para ejecutar workers**:

```bash
celery -A intranet_proyectos.celeryapp worker --loglevel=info
```

**Nota**: En producción, los workers deberían ejecutarse como servicios separados (systemd, supervisor, o instancias EC2 dedicadas).

### Almacenamiento S3

- **Static Files**: `https://{bucket}.s3.amazonaws.com/static/`
- **Media Files**: `https://{bucket}.s3.amazonaws.com/media/`
- **Configuración**: Gzip habilitado, Cache-Control configurado

## Archivos Excluidos del Deployment

Según `.gitignore`, estos archivos NO se incluyen:

- `db.sqlite3`
- `.idea/*`
- `/secretsLocal.json`
- `/webpack-stats-local.json`
- `/node_modules`
- `/venv_intranet_proyectos/`
- `media/*`
- `/webpack-stats.json`

**Importante**: Asegurarse de que `webpack-stats-prod.json` SÍ esté incluido (no está en .gitignore).

## Problemas Comunes y Soluciones

### 1. Error en Migraciones

**Síntoma**: Deployment falla en `01_migrate`

**Solución**:

- Verificar conexión a base de datos
- Revisar logs: `eb logs`
- Verificar que las migraciones estén en el repositorio

### 2. Error en Collectstatic

**Síntoma**: Deployment falla en `03_collectstatic`

**Solución**:

- Verificar credenciales de S3
- Verificar permisos del bucket S3
- Verificar que `webpack-stats-prod.json` exista
- Revisar configuración de `custom_storages.py`

### 3. Frontend no carga

**Síntoma**: La aplicación carga pero el frontend no aparece

**Solución**:

- Verificar que `npm run build_prod` se ejecutó antes del deployment
- Verificar que `webpack-stats-prod.json` existe y está actualizado
- Verificar configuración de `WEBPACK_LOADER` en settings
- Revisar logs del navegador para errores 404

### 4. Error de permisos en S3

**Síntoma**: No se pueden subir archivos estáticos

**Solución**:

- Verificar IAM roles y políticas
- Verificar credenciales AWS
- Verificar que el bucket existe y tiene los permisos correctos

### 5. Celery no procesa tareas

**Síntoma**: Las tareas asíncronas no se ejecutan

**Solución**:

- Verificar que los workers estén corriendo
- Verificar conexión a Redis
- Revisar logs de Celery
- Verificar configuración de `CELERY_BROKER_URL`

## Mejores Prácticas Recomendadas

### 1. Seguridad

- ⚠️ **CRÍTICO**: El comando `makesuper` tiene credenciales hardcodeadas. Debería:

  - Usar variables de entorno
  - Ser `leader_only: true`
  - Usar contraseñas seguras desde secrets manager

- Usar AWS Secrets Manager para credenciales sensibles
- Rotar credenciales regularmente
- Habilitar HTTPS/SSL en Elastic Beanstalk

### 2. Performance

- Configurar Auto Scaling en Elastic Beanstalk
- Usar CloudFront CDN para archivos estáticos
- Implementar cache de queries frecuentes
- Optimizar queries de base de datos

### 3. Monitoreo

- Configurar CloudWatch alarms
- Monitorear logs de aplicación
- Trackear métricas de performance
- Configurar alertas de errores

### 4. CI/CD

- Automatizar el build del frontend antes del deployment
- Integrar con CodePipeline para CI/CD
- Implementar tests antes del deployment
- Usar staging environment para pruebas

### 5. Backup

- Configurar backups automáticos de RDS
- Versionado de S3 habilitado
- Documentar procedimientos de rollback

## Comandos Útiles

```bash
# Ver logs en tiempo real
eb logs --stream

# Ver logs específicos
eb logs --all

# Ver configuración actual
eb printenv

# Cambiar tamaño de instancia
eb scale 2

# Rollback a versión anterior
eb deploy --version <version-label>

# Listar versiones desplegadas
eb appversion

# Ver health del entorno
eb health

# Ver eventos recientes
eb events
```

## Referencias

- [AWS Elastic Beanstalk Python Documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-apps.html)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/)
- [Django Webpack Loader](https://github.com/owais/django-webpack-loader)
- [Django Storages S3](https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html)

---

**Última actualización**: 2024
**Versión**: 1.0
