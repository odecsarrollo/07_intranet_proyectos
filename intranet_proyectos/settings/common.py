from datetime import timedelta
import os

from configurations import Configuration


def str_to_bool(s):
    if s == 'True':
        return True
    elif s == 'False':
        return False
    else:
        raise ValueError


class Common(Configuration):
    # Build paths inside the project like this: os.path.join(BASE_DIR, ...)
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    SITE_ROOT = os.path.dirname(BASE_DIR)

    # Quick-start development settings - unsuitable for production
    # See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

    # SECURITY WARNING: keep the secret key used in production secret!
    SECRET_KEY = 'grb%s=$ddb_0&alrc^5w$0g7%wgj@^%m$9l64m6!pg9-z)l+h_'

    ALLOWED_HOSTS = ['*']

    # Application definition

    DJANGO_APPS = [
        'django.contrib.admin',
        'django.contrib.sites',
        'registration',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
        'django.contrib.humanize',
    ]

    MY_APPS = [
        'index.apps.IndexConfig',
        'permisos.apps.PermisosConfig',
        'cguno.apps.CgunoConfig',
        'proyectos.apps.ProyectosConfig',
        'mano_obra.apps.ManoObraConfig',
        'clientes.apps.ClientesConfig',
        'cotizaciones.apps.CotizacionesConfig',
        'configuraciones.apps.ConfiguracionesConfig',
        'proyectos_seguimientos.apps.ProyectosSeguimientosConfig',
        'bandas_eurobelt.apps.BandasEurobeltConfig',
        'sistema_informacion_origen.apps.SistemaInformacionOrigenConfig',
        'geografia.apps.GeografiaConfig',
        'cargues_catalogos.apps.CarguesCatalogosConfig',
        'cargues_detalles.apps.CarguesDetallesConfig',
        'items.apps.ItemsConfig',
        'importaciones.apps.ImportacionesConfig',
        'listas_precios.apps.ListasPreciosConfig',
        'catalogo_productos.apps.CatalogoProductosConfig',
        'medios_adhesivos.apps.MediosAdhesivosConfig',
        'contabilidad_anticipos.apps.ContabilidadAnticiposConfig',
        'sistemas_equipos.apps.SistemasEquiposConfig',
        'cotizaciones_componentes.apps.CotizacionesComponentesConfig',
        'envios_emails.apps.EnviosEmailsConfig',
    ]

    THIRD_PART_APPS = [
        'imagekit',
        'model_utils',
        'crispy_forms',
        'rest_framework',
        'knox',
        'webpack_loader',
        'corsheaders',
        'reversion',
        'silk',
    ]

    # See: https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
    INSTALLED_APPS = DJANGO_APPS + MY_APPS + THIRD_PART_APPS

    REST_FRAMEWORK = {
        'DEFAULT_AUTHENTICATION_CLASSES': ('knox.auth.TokenAuthentication',),
        'COERCE_DECIMAL_TO_STRING': False
    }

    MIDDLEWARE = [
        'django.middleware.security.SecurityMiddleware',
        'django.contrib.sessions.middleware.SessionMiddleware',
        'corsheaders.middleware.CorsMiddleware',
        'django.middleware.common.CommonMiddleware',
        'django.middleware.csrf.CsrfViewMiddleware',
        'django.contrib.auth.middleware.AuthenticationMiddleware',
        'django.contrib.messages.middleware.MessageMiddleware',
        'django.middleware.clickjacking.XFrameOptionsMiddleware',
    ]

    ROOT_URLCONF = 'intranet_proyectos.urls'
    DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760
    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [os.path.join(SITE_ROOT, 'templates')]
            ,
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]

    WSGI_APPLICATION = 'intranet_proyectos.wsgi.application'

    # Database
    # https://docs.djangoproject.com/en/2.0/ref/settings/#databases

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

    # Password validation
    # https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

    ########## STATIC FILE CONFIGURATION
    STATICFILES_DIRS = [
        os.path.normpath(os.path.join(SITE_ROOT, "static"))
    ]
    ########## END STATIC FILE CONFIGURATION

    AUTH_PASSWORD_VALIDATORS = [
        {
            'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        },
        {
            'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        },
    ]

    # Internationalization
    # https://docs.djangoproject.com/en/2.0/topics/i18n/

    LANGUAGE_CODE = 'es-CO'

    TIME_ZONE = 'America/Bogota'

    USE_I18N = True

    USE_L10N = True

    USE_TZ = True

    SITE_ID = 1

    USE_THOUSAND_SEPARATOR = True

    STATIC_URL = '/static/'
    MEDIA_URL = '/media/'
    MEDIA_ROOT = "media"
    STATIC_ROOT = "/static/"

    REST_KNOX = {
        'TOKEN_TTL': timedelta(hours=15),
    }

    CORS_ORIGIN_ALLOW_ALL = True
    CORS_URLS_REGEX = r'^/api/.*$'
    CORS_ALLOW_CREDENTIALS = True
