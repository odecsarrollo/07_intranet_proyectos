import json

from django.core.exceptions import ImproperlyConfigured

from .base import *

with open("secretsLocal.json") as f:
    secrets = json.loads(f.read())


def get_secret(setting, variable, secrets=secrets):
    """ Get the environment setting or return exception """
    try:
        return secrets[setting][variable]
    except KeyError:
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

EMAIL_HOST = get_secret("EMAIL_SERVER", "EMAIL_HOST")

EMAIL_HOST_PASSWORD = get_secret("EMAIL_SERVER", "EMAIL_HOST_PASSWORD")

EMAIL_HOST_USER = get_secret("EMAIL_SERVER", "EMAIL_HOST_USER")

EMAIL_PORT = get_secret("EMAIL_SERVER", "EMAIL_PORT")

EMAIL_SUBJECT_PREFIX = '[%s] ' % 'Odecopack'

EMAIL_USE_TLS = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_TLS"))

SERVER_EMAIL = get_secret("EMAIL_SERVER", "SERVER_EMAIL")

EMAIL_USE_SSL = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_SSL"))

DEFAULT_FROM_EMAIL = get_secret("EMAIL_SERVER", "DEFAULT_FROM_EMAIL")

AWS_ACCESS_KEY_ID = get_secret("AWS", "AWS_ACCESS_KEY")

AWS_SECRET_ACCESS_KEY = get_secret("AWS", "AWS_SECRET_ACCESS_KEY")
