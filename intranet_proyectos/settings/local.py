from django.core.exceptions import ImproperlyConfigured

from .base import *

############### SECRET FILE
import json

with open("secretsLocal.json") as f:
    secrets = json.loads(f.read())


def get_secret(setting, variable, secrets=secrets):
    """ Get the environment setting or return exception """
    try:
        return secrets[setting][variable]
    except KeyError:
        error_msg = "Set the {0} environment variable".format(setting)
        raise ImproperlyConfigured(error_msg)


THIRD_PART_APPS = [
    'silk',
]

INSTALLED_APPS = INSTALLED_APPS + THIRD_PART_APPS

########## DEBUG TOOLBAR CONFIGURATION CONFIGURATION
MIDDLEWARE += [
    'silk.middleware.SilkyMiddleware',
]
########## END TOOLBAR CONFIGURATION CONFIGURATION

########## DATABASE CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#databases
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
########## END DATABASE CONFIGURATION

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'assets/bundles/deve/',
        'STATS_FILE': os.path.join(SITE_ROOT, 'webpack-stats-local.json'),
    }
}

# 'EMAIL_IS_LOCAL'
if not str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_IS_LOCAL")):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-host
EMAIL_HOST = get_secret("EMAIL_SERVER", "EMAIL_HOST")

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-host-password
EMAIL_HOST_PASSWORD = get_secret("EMAIL_SERVER", "EMAIL_HOST_PASSWORD")

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-host-user
EMAIL_HOST_USER = get_secret("EMAIL_SERVER", "EMAIL_HOST_USER")

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-port
EMAIL_PORT = get_secret("EMAIL_SERVER", "EMAIL_PORT")

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-subject-prefix
EMAIL_SUBJECT_PREFIX = '[%s] ' % 'Odecopack'

# See: https://docs.djangoproject.com/en/dev/ref/settings/#email-use-tls
EMAIL_USE_TLS = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_TLS"))

# See: https://docs.djangoproject.com/en/dev/ref/settings/#server-email
SERVER_EMAIL = get_secret("EMAIL_SERVER", "SERVER_EMAIL")

EMAIL_USE_SSL = str_to_bool(get_secret("EMAIL_SERVER", "EMAIL_USE_SSL"))

DEFAULT_FROM_EMAIL = get_secret("EMAIL_SERVER", "DEFAULT_FROM_EMAIL")

########## END EMAIL CONFIGURATION
