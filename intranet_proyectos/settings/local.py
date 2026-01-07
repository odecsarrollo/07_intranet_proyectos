import json
import os

from django.core.exceptions import ImproperlyConfigured

from .base import *

# Intentar cargar secretsLocal.json si existe, sino usar valores por defecto
secrets = {}
secrets_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "secretsLocal.json")
if os.path.exists(secrets_path):
    with open(secrets_path) as f:
        secrets = json.loads(f.read())


def get_secret(setting, variable, secrets=secrets, default=None):
    """ Get the environment setting or return default/exception """
    try:
        return secrets[setting][variable]
    except KeyError:
        if default is not None:
            return default
        error_msg = "Set the {0} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)


DEBUG = True
THIRD_PART_APPS = []

INSTALLED_APPS = INSTALLED_APPS + THIRD_PART_APPS

MIDDLEWARE = MIDDLEWARE + [
    'silk.middleware.SilkyMiddleware',
]
# DATABASE_ROUTERS = ['intranet_proyectos.settings.database_router.PrimaryReplicaRouter']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'proyectos_intranet',
        'USER': 'root',
        'PASSWORD': '1234',
        'HOST': 'localhost',
        'PORT': '3306',
        'ATOMIC_REQUESTS': True,
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
        }
    },
    'read_only': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'proyectos_intranet',
        'USER': 'root',
        'PASSWORD': '1234',
        'HOST': 'localhost',
        'PORT': '3306',
        'ATOMIC_REQUESTS': True,
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
        }
    }
}

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'assets/bundles/deve/',
        'STATS_FILE': os.path.join(SITE_ROOT, 'webpack-stats-local.json'),
    }
}

ENVIAR_SMS = False

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

EMAIL_HOST = get_secret("EMAIL_SERVER", "EMAIL_HOST", default="localhost")

EMAIL_HOST_PASSWORD = get_secret("EMAIL_SERVER", "EMAIL_HOST_PASSWORD", default="")

EMAIL_HOST_USER = get_secret("EMAIL_SERVER", "EMAIL_HOST_USER", default="")

EMAIL_PORT = get_secret("EMAIL_SERVER", "EMAIL_PORT", default="587")

EMAIL_SUBJECT_PREFIX = '[%s] ' % 'Odecopack'

EMAIL_USE_TLS = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_TLS", default="False"))

SERVER_EMAIL = get_secret("EMAIL_SERVER", "SERVER_EMAIL", default="noreply@odecopack.com")

EMAIL_USE_SSL = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_SSL", default="False"))

DEFAULT_FROM_EMAIL = get_secret("EMAIL_SERVER", "DEFAULT_FROM_EMAIL", default="noreply@odecopack.com")

AWS_ACCESS_KEY_ID = get_secret("AWS", "AWS_ACCESS_KEY", default="")

AWS_SECRET_ACCESS_KEY = get_secret("AWS", "AWS_SECRET_ACCESS_KEY", default="")
