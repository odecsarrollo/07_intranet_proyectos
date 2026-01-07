# Arquitectura Cloud - Intranet Proyectos

## Descripción General

Este proyecto es una aplicación web Django 2.2.6 con frontend React que se despliega en AWS utilizando Elastic Beanstalk. La aplicación gestiona proyectos, cotizaciones, clientes y otros módulos de negocio para Odecopack.

## Stack Tecnológico

### Backend
- **Framework**: Django 2.2.6
- **API**: Django REST Framework 3.9.4
- **Autenticación**: Django REST Knox
- **Base de Datos**: MySQL (RDS con réplica de solo lectura)
- **Cache/Broker**: Redis (ElastiCache)
- **Tareas Asíncronas**: Celery 4.4.6 con Redis
- **Almacenamiento**: AWS S3 (us-west-2)
- **Python**: 3.6

### Frontend
- **Framework**: React 16.13.1
- **Build Tool**: Webpack 4.32.2
- **Estado**: Redux
- **UI**: Bootstrap 4, FontAwesome Pro

## Arquitectura AWS

### Servicios Utilizados

1. **AWS Elastic Beanstalk**
   - Plataforma: Python 3.6
   - WSGI Path: `intranet_proyectos/wsgi.py`
   - Configuración: `.ebextensions/`

2. **Amazon S3**
   - Región: us-west-2
   - Uso: Almacenamiento de archivos estáticos y media
   - Buckets:
     - Static files: `{S3_BUCKET_NAME}/static/`
     - Media files: `{S3_BUCKET_NAME}/media/`
   - Configuración:
     - Gzip habilitado
     - Cache-Control: max-age=604800
     - Custom domain: `{bucket}.s3.amazonaws.com`

3. **Amazon ElastiCache (Redis)**
   - Endpoint: `odecoredis.hiw7zx.0001.usw2.cache.amazonaws.com:6379`
   - Uso: Broker de Celery y cache
   - Base de datos: 0

4. **Amazon RDS (MySQL)**
   - Configuración:
     - Base de datos principal (lectura/escritura)
     - Réplica de solo lectura para consultas
     - SQL Mode: STRICT_TRANS_TABLES

5. **SMTP Email**
   - Backend: Django SMTP
   - Configuración mediante variables de entorno

## Variables de Entorno Requeridas

### Configuración Django
```bash
DJANGO_CONFIGURATION=Production
DJANGO_SETTINGS_MODULE=intranet_proyectos.settings
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

### Opcional
```bash
ENVIAR_SMS=on|off
```

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet / Users                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              AWS Elastic Beanstalk                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Django Application (Python 3.6)               │   │
│  │  - WSGI Application                                   │   │
│  │  - Django REST Framework API                         │   │
│  │  - React Frontend (Static Files)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Celery Workers                                │   │
│  │  - Tareas asíncronas                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Amazon S3   │  │  ElastiCache │  │  Amazon RDS  │
│  (Static &   │  │  (Redis)     │  │  (MySQL)     │
│   Media)     │  │              │  │  - Primary   │
│              │  │  - Celery    │  │  - Replica   │
│  us-west-2   │  │    Broker    │  │    (read)    │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Configuración de Infraestructura

### 1. S3 Bucket

```bash
# Crear bucket S3
aws s3 mb s3://<bucket-name> --region us-west-2

# Configurar CORS (si es necesario)
# Configurar políticas de acceso
# Habilitar versionado (opcional)
# Configurar lifecycle policies (opcional)
```

### 2. ElastiCache Redis

```bash
# Crear cluster Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id odecoredis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --region us-west-2
```

### 3. RDS MySQL

```bash
# Crear instancia principal
aws rds create-db-instance \
  --db-instance-identifier proyectos-intranet-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username <admin-user> \
  --master-user-password <admin-password> \
  --allocated-storage 20 \
  --region us-west-2

# Crear réplica de solo lectura
aws rds create-db-instance-read-replica \
  --db-instance-identifier proyectos-intranet-db-replica \
  --source-db-instance-identifier proyectos-intranet-db \
  --region us-west-2
```

### 4. Elastic Beanstalk

```bash
# Inicializar aplicación EB
eb init -p python-3.6 intranet-proyectos --region us-west-2

# Crear entorno
eb create intranet-proyectos-prod \
  --instance-type t3.small \
  --envvars DJANGO_CONFIGURATION=Production \
  --region us-west-2

# Configurar variables de entorno
eb setenv \
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
```

## Configuración de Seguridad

### IAM Roles y Políticas

1. **Rol para Elastic Beanstalk**
   - Permisos S3: `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`
   - Permisos RDS: Conectar a instancias RDS
   - Permisos ElastiCache: Conectar a cluster Redis

2. **Política S3**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::bucket-name/*"
    }
  ]
}
```

### Security Groups

- **Elastic Beanstalk**: Permitir HTTP (80), HTTPS (443)
- **RDS**: Permitir MySQL (3306) solo desde Elastic Beanstalk
- **ElastiCache**: Permitir Redis (6379) solo desde Elastic Beanstalk

## Deployment

El proceso completo de deployment está documentado en detalle en **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### Resumen del Proceso

1. **Build Frontend**
```bash
npm run build_prod
```

2. **Deploy a Elastic Beanstalk**
```bash
eb deploy
```

El deployment automático ejecuta:
- Instalación de paquetes del sistema
- Instalación de dependencias Python
- Migraciones de base de datos
- Recolección de archivos estáticos (a S3)
- Configuración inicial de la aplicación

### Comandos Útiles

```bash
# Ver logs
eb logs

# SSH al servidor
eb ssh

# Ver estado
eb status

# Abrir en navegador
eb open

# Listar entornos
eb list
```

**Para más detalles, ver [DEPLOYMENT.md](./DEPLOYMENT.md)**

## Monitoreo y Logging

### CloudWatch

- Logs de aplicación Django
- Métricas de Elastic Beanstalk
- Métricas de RDS
- Métricas de ElastiCache

### Configuración de Logs

Los logs de Django se pueden configurar para enviarse a CloudWatch mediante la configuración de logging en `settings/production.py`.

## Escalabilidad

### Auto Scaling

- Configurar Auto Scaling Group en Elastic Beanstalk
- Mínimo: 1 instancia
- Máximo: 4 instancias
- Métrica: CPU > 70%

### Base de Datos

- Usar réplica de solo lectura para consultas
- Considerar RDS Multi-AZ para alta disponibilidad
- Configurar backups automáticos

### Cache

- Usar Redis para cache de sesiones
- Implementar cache de queries frecuentes

## Backup y Recuperación

### RDS

- Backups automáticos diarios
- Retention: 7 días
- Snapshots manuales antes de cambios importantes

### S3

- Versionado habilitado (recomendado)
- Lifecycle policies para archivos antiguos
- Cross-region replication (opcional)

## Costos Estimados (us-west-2)

- **Elastic Beanstalk (t3.small)**: ~$15/mes
- **RDS MySQL (db.t3.micro)**: ~$15/mes
- **ElastiCache Redis (cache.t3.micro)**: ~$12/mes
- **S3 Storage (100GB)**: ~$2.30/mes
- **Data Transfer**: Variable

**Total estimado**: ~$45-60/mes (sin considerar data transfer)

## Mejores Prácticas

1. **Seguridad**
   - Usar Secrets Manager para credenciales
   - Habilitar HTTPS/SSL
   - Configurar WAF si es necesario
   - Rotar credenciales regularmente

2. **Performance**
   - Usar CDN (CloudFront) para archivos estáticos
   - Implementar cache de queries
   - Optimizar queries de base de datos
   - Usar compresión Gzip

3. **Monitoreo**
   - Configurar alertas en CloudWatch
   - Monitorear errores de aplicación
   - Trackear métricas de performance
   - Configurar notificaciones de errores

4. **CI/CD**
   - Integrar con CodePipeline
   - Automatizar tests antes de deploy
   - Usar staging environment
   - Implementar blue-green deployments

## Troubleshooting

### Problemas Comunes

1. **Error de conexión a RDS**
   - Verificar Security Groups
   - Verificar credenciales
   - Verificar endpoint correcto

2. **Error de conexión a Redis**
   - Verificar Security Groups
   - Verificar endpoint de ElastiCache
   - Verificar que el cluster esté disponible

3. **Error de S3**
   - Verificar credenciales AWS
   - Verificar permisos IAM
   - Verificar que el bucket exista

4. **Celery no procesa tareas**
   - Verificar conexión a Redis
   - Verificar que los workers estén corriendo
   - Revisar logs de Celery

## Contacto y Soporte

Para más información sobre la configuración de cloud, consultar:
- Documentación AWS Elastic Beanstalk
- Documentación Django deployment
- Documentación del proyecto interno

---

**Última actualización**: 2024
**Versión**: 1.0

