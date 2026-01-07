# Actualización a Python 3.14 y Django 4.2+

## Resumen de Cambios

Este documento describe la actualización del proyecto de **Python 3.6** a **Python 3.14** y de **Django 2.2.6** a **Django 4.2+**.

## Archivos Modificados

### 1. Configuración de Python
- ✅ **Pipfile**: Actualizado `python_version = "3.14"`
- ✅ **.elasticbeanstalk/config.yml**: Actualizado `default_platform: Python 3.14`
- ✅ **runtime.txt**: Creado nuevo archivo con `python-3.14`

### 2. Dependencias Actualizadas

#### Django y Framework
- **Django**: `2.2.6` → `>=4.2,<5.1` (Django 4.2 LTS o superior)
- **Django REST Framework**: `3.9.4` → `>=3.14.0`

#### Extensiones de Django
- **django-webpack-loader**: `0.6.0` → `>=2.0.0`
- **django-storages**: `1.7.1` → `>=1.14.0`
- **django-silk**: `3.0.2` → `>=5.0.0`
- **django-rest-knox**: `4.1.0` → `>=4.3.0`
- **django-model-utils**: `3.1.1` → `>=4.3.0`
- **django-imagekit**: `4.0.2` → `>=5.2.0`
- **django-reversion**: `3.0.4` → `>=5.0.0`
- **django-cors-headers**: `3.0.1` → `>=4.0.0`

#### Base de Datos
- **mysqlclient**: `1.4.2.post1` → `>=2.1.1`

#### AWS
- **boto3**: `1.9.195` → `>=1.28.0`
- **botocore**: `1.12.253` → `>=1.31.0`

#### Cola de Tareas
- **celery**: `4.4.6` → `>=5.3.0`
- **redis**: `3.5.3` → `>=5.0.0`
- **kombu**: `4.6.11` → `>=5.3.0`
- **amqp**: `2.6.0` → `>=5.2.0`
- **billiard**: `3.6.3.0` → `>=4.2.0`

#### Generación de PDFs
- **weasyprint**: `0.42.3` → `>=60.0` ⚠️ **Cambio mayor**
- **cairocffi**: `0.8.0` → `>=1.7.0`
- **cairosvg**: `2.1.3` → `>=2.7.0`

#### Procesamiento de Imágenes
- **pillow**: `7.2.0` → `>=10.0.0`
- **pilkit**: `2.0` → `>=3.0.0`

#### Utilidades
- **pypdf2**: `1.26.0` → `>=3.0.0`
- **requests**: `2.24.0` → `>=2.31.0`
- **urllib3**: `1.25.9` → `>=2.0.0` ⚠️ **Cambio mayor**
- **cryptography**: `3.0` → `>=41.0.0`

## Cambios Importantes en Django 2.2 → 4.2+

### ⚠️ Breaking Changes Principales

#### 1. Cambios en URLs
Django 4.0 eliminó el uso de `django.conf.urls` a favor de `django.urls`:

```python
# ❌ Antes (Django 2.2)
from django.conf.urls import url

# ✅ Ahora (Django 4.2+)
from django.urls import path, re_path
```

#### 2. Cambios en `MIDDLEWARE`
Algunos middlewares cambiaron de ubicación:

```python
# ❌ Antes
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    ...
]

# ✅ Verificar compatibilidad de middlewares personalizados
```

#### 3. Cambios en `USE_L10N`
En Django 4.0, `USE_L10N` se deprecó y se eliminó en 4.1. La localización está siempre activada.

```python
# ❌ Eliminar de settings.py
USE_L10N = True

# ✅ Se maneja automáticamente
```

#### 4. Cambios en `DEFAULT_AUTO_FIELD`
Django 3.2+ requiere definir explícitamente:

```python
# ✅ Agregar en settings/base.py
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
```

#### 5. Cambios en `url()` vs `path()`
Las URLs deben actualizarse:

```python
# ❌ Antes
url(r'^api/users/$', views.user_list)

# ✅ Ahora
path('api/users/', views.user_list)
# O con regex:
re_path(r'^api/users/$', views.user_list)
```

#### 6. Cambios en `force_text` y `force_str`
```python
# ❌ Antes
from django.utils.encoding import force_text

# ✅ Ahora
from django.utils.encoding import force_str
```

#### 7. Cambios en `ugettext` y `ugettext_lazy`
```python
# ❌ Antes
from django.utils.translation import ugettext, ugettext_lazy

# ✅ Ahora
from django.utils.translation import gettext, gettext_lazy
```

## Próximos Pasos

### 1. Actualizar Código Python

Revisar y actualizar todos los archivos que usen:
- `django.conf.urls.url` → `django.urls.re_path` o `path`
- `force_text` → `force_str`
- `ugettext` → `gettext`
- `ugettext_lazy` → `gettext_lazy`

### 2. Verificar Compatibilidad de Aplicaciones

Verificar que todas las aplicaciones Django sean compatibles:
- Revisar imports obsoletos
- Verificar uso de APIs deprecadas
- Actualizar tests si es necesario

### 3. Actualizar Configuraciones

#### Agregar en `settings/base.py`:
```python
# Django 4.2+ requiere esto
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Verificar que esto esté configurado
USE_TZ = True
TIME_ZONE = 'UTC'  # O tu zona horaria
```

### 4. Actualizar Migraciones

Si hay modelos que usan `AutoField` sin especificar:

```bash
# Generar nuevas migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate
```

### 5. Probar WeasyPrint

WeasyPrint tuvo un cambio mayor (0.x → 60.x). Verificar que la generación de PDFs funcione correctamente.

### 6. Verificar Celery

Celery 5.x tiene cambios en la configuración. Verificar:
- `intranet_proyectos/celeryapp.py`
- Configuración de brokers
- Tareas asíncronas

## Instalación

### Instalar Dependencias Actualizadas

```bash
# Con pip
pip install -r requirements.txt

# O con pipenv
pipenv install --python 3.14
pipenv install
```

### Verificar Instalación

```bash
python --version  # Debe mostrar Python 3.14.x
python manage.py check
python manage.py runserver
```

## Notas Importantes

### ⚠️ Advertencias

1. **WeasyPrint 60.x**: Cambios significativos en la API. Revisar código que genere PDFs.
2. **urllib3 2.x**: Cambios en la API. Algunos paquetes pueden necesitar actualización.
3. **Django 4.2+**: Requiere actualización de código para APIs deprecadas.
4. **Celery 5.x**: Cambios en configuración y APIs.

### ✅ Compatibilidad

- Python 3.14 soporta todas las nuevas características
- Django 4.2 LTS tiene soporte hasta 2026
- Todas las dependencias están actualizadas a versiones modernas

## Referencias

- [Django 4.2 Release Notes](https://docs.djangoproject.com/en/4.2/releases/4.2/)
- [Django 4.0 Release Notes](https://docs.djangoproject.com/en/4.0/releases/4.0/)
- [Python 3.14 Release Notes](https://docs.python.org/3.14/whatsnew/3.14.html)
- [WeasyPrint Migration Guide](https://doc.courtbouillon.org/weasyprint/stable/)

---

**Fecha de actualización**: 2025-01-07  
**Python**: 3.6 → 3.14  
**Django**: 2.2.6 → 4.2+

