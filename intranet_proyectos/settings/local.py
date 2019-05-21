from .base import *

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
