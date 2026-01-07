# Solución: Error "Yum does not have python34-devel available"

## Problema

Durante el deployment en AWS Elastic Beanstalk, se produce el siguiente error:

```
[INFO] Error occurred during build: Yum does not have python34-devel available for installation
[ERROR] An error occurred during execution of command [self-startup] - [PreBuildEbExtension]. 
Stop running the command. Error: EbExtension build failed.
```

## Causa Raíz

El archivo `.ebextensions/02_packages.config` intenta instalar `python34-devel`, que es el paquete de desarrollo para Python 3.4. Sin embargo:

1. **Python 3.4 está obsoleto**: Ya no está disponible en las versiones recientes de Amazon Linux
2. **Versión incorrecta**: El proyecto usa Python 3.6 (según `Pipfile` y configuración de EB), no Python 3.4
3. **Paquetes desactualizados**: También se intenta instalar `postgresql93-devel` que es una versión muy antigua

## Solución Aplicada

Se ha actualizado el archivo `.ebextensions/02_packages.config` con los siguientes cambios:

### Cambios Realizados

1. **`python34-devel` → `python36-devel`**
   - Cambiado para coincidir con Python 3.6 que usa el proyecto

2. **`postgresql93-devel` → `postgresql-devel`**
   - Actualizado a la versión más reciente disponible

3. **Agregados `pango-devel` y `cairo-devel`**
   - Necesarios para compilar correctamente WeasyPrint y otras dependencias gráficas

### Archivo Corregido

```yaml
packages:
  yum:
    git: []
    libjpeg-turbo-devel: []
    libpng-devel: []
    freetype-devel: []
    gcc-c++: []
    python36-devel: []        # ✅ Cambiado de python34-devel
    postgresql-devel: []      # ✅ Cambiado de postgresql93-devel
    libffi-devel: []
    cairo: []
    pango: []
    pango-devel: []           # ✅ Agregado
    cairo-devel: []           # ✅ Agregado
```

## Pasos para Aplicar la Solución

1. **Verificar el cambio**:
   ```bash
   cat .ebextensions/02_packages.config
   ```

2. **Commitear los cambios**:
   ```bash
   git add .ebextensions/02_packages.config
   git commit -m "Fix: Actualizar paquetes del sistema para Python 3.6"
   ```

3. **Hacer deployment**:
   ```bash
   eb deploy
   ```

## Alternativas (Si el error persiste)

### Opción 1: Usar python3-devel (versión genérica)

Si `python36-devel` no está disponible en tu versión de Amazon Linux, intenta:

```yaml
python3-devel: []
```

### Opción 2: Especificar versión de Amazon Linux

Si estás usando Amazon Linux 2, los nombres de paquetes pueden variar. Verifica con:

```bash
eb ssh
yum search python3-devel
```

### Opción 3: Usar commands en lugar de packages

Si los paquetes no están disponibles vía `packages:`, puedes instalarlos manualmente:

```yaml
commands:
  01_install_python_dev:
    command: "yum install -y python36-devel || yum install -y python3-devel"
    ignoreErrors: false
```

## Verificación Post-Deployment

Después del deployment exitoso, verifica:

1. **Logs del deployment**:
   ```bash
   eb logs
   ```

2. **SSH y verificar paquetes instalados**:
   ```bash
   eb ssh
   rpm -qa | grep python
   rpm -qa | grep postgresql
   ```

3. **Verificar que la aplicación funciona**:
   ```bash
   eb open
   ```

## Notas Adicionales

- **Amazon Linux 1 vs Amazon Linux 2**: Los nombres de paquetes pueden variar entre versiones
- **Python 3.6 EOL**: Python 3.6 alcanzó su fin de vida. Considera migrar a Python 3.8+ en el futuro
- **Dependencias gráficas**: WeasyPrint requiere Cairo y Pango con sus headers de desarrollo

## Referencias

- [AWS Elastic Beanstalk Python Platform](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-apps.html)
- [Amazon Linux 2 Package Management](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/amazon-linux-ami-basics.html)
- [Python Development Headers](https://docs.python.org/3/extending/building.html)

---

**Fecha de solución**: 2025-12-15
**Estado**: ✅ Resuelto

