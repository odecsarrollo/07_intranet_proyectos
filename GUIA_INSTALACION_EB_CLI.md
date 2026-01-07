# Guía de Instalación y Configuración de EB CLI

## ✅ Instalación Completada

El comando `eb` (Elastic Beanstalk CLI) ha sido instalado exitosamente.

**Versión instalada**: EB CLI 3.25.3

## Configuración Inicial

### 1. Verificar Instalación

```bash
eb --version
```

Debería mostrar: `EB CLI 3.25.3`

### 2. Configurar Credenciales AWS

Antes de usar EB CLI, necesitas configurar tus credenciales de AWS. Tienes dos opciones:

#### Opción A: Usar AWS CLI (Recomendado)

```bash
# AWS CLI ya está instalado ✅
# Verificar instalación
aws --version

# Configurar credenciales
aws configure
```

Te pedirá:

- AWS Access Key ID
- AWS Secret Access Key
- Default region: `us-west-2` (según tu configuración)
- Default output format: `json`

#### Opción B: Variables de Entorno

```bash
export AWS_ACCESS_KEY_ID=tu-access-key
export AWS_SECRET_ACCESS_KEY=tu-secret-key
export AWS_DEFAULT_REGION=us-west-2
```

### 3. Inicializar Elastic Beanstalk (Primera vez)

Si es la primera vez que usas EB CLI en este proyecto:

```bash
cd /Users/bholguin/Documents/Odecopack/07_intranet_proyectos

# Inicializar EB
eb init -p python-3.6 intranet-proyectos --region us-west-2
```

Esto creará un archivo `.elasticbeanstalk/config.yml` con la configuración.

### 4. Verificar Entornos Existentes

Si ya tienes un entorno configurado:

```bash
# Listar entornos
eb list

# Ver información del entorno actual
eb status
```

### 5. Configurar Variables de Entorno

Si necesitas configurar variables de entorno:

```bash
eb setenv \
  DJANGO_CONFIGURATION=Production \
  DJANGO_SECRET_KEY=tu-secret-key \
  DB_ENGINE=django.db.backends.mysql \
  DB_NAME=tu-db-name \
  DB_USER=tu-db-user \
  DB_PASSWORD=tu-db-password \
  DB_HOST=tu-rds-endpoint \
  DB_HOST_REPLICA=tu-rds-replica-endpoint \
  S3_BUCKET_NAME=tu-bucket-name \
  AWS_ACCESS_KEY=tu-access-key \
  AWS_SECRET_ACCESS_KEY=tu-secret-key \
  EMAIL_HOST=tu-smtp-host \
  EMAIL_HOST_USER=tu-smtp-user \
  EMAIL_HOST_PASSWORD=tu-smtp-password \
  EMAIL_PORT=587 \
  EMAIL_USE_TLS=True \
  ADMIN_NAME=tu-nombre \
  ADMIN_EMAIL=tu-email
```

### 6. Hacer Deployment

Una vez configurado todo:

```bash
# Build del frontend primero
npm run build_prod

# Deploy
eb deploy
```

## Comandos Útiles

```bash
# Ver logs
eb logs

# Ver logs en tiempo real
eb logs --stream

# Ver estado del entorno
eb status

# Abrir aplicación en navegador
eb open

# SSH al servidor
eb ssh

# Ver configuración actual
eb printenv

# Listar versiones desplegadas
eb appversion

# Ver eventos recientes
eb events

# Ver health del entorno
eb health
```

## Solución de Problemas

### Error: "No application named 'xxx' found"

Necesitas inicializar EB primero:

```bash
eb init
```

### Error: "No default VPC"

Necesitas crear una VPC o especificar una existente durante `eb init`.

### Error: "Credentials not found"

Configura tus credenciales AWS:

```bash
aws configure
```

### Error: "Region not specified"

Especifica la región:

```bash
eb init --region us-west-2
```

## Notas Importantes

1. **Primera vez**: Si es la primera vez, necesitas ejecutar `eb init` antes de hacer deploy
2. **Build Frontend**: Siempre ejecuta `npm run build_prod` antes de `eb deploy`
3. **Variables de Entorno**: Asegúrate de configurar todas las variables necesarias
4. **Región**: El proyecto está configurado para `us-west-2`

## Referencias

- [EB CLI Documentation](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html)
- [EB CLI Commands](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-commands.html)

---

**Última actualización**: 2025-12-15
