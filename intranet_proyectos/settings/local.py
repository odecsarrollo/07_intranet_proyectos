from .base import *

THIRD_PART_APPS = [
    'debug_toolbar',
]

INSTALLED_APPS = INSTALLED_APPS + THIRD_PART_APPS

########## STATIC FILE CONFIGURATION
STATICFILES_DIRS = [
    os.path.normpath(os.path.join(SITE_ROOT, "static"))
]
########## END STATIC FILE CONFIGURATION

########## DEBUG TOOLBAR CONFIGURATION CONFIGURATION
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware', ]
INTERNAL_IPS = '127.0.0.1'
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
        'STATS_FILE': os.path.join(SITE_ROOT, 'webpack-stats.json'),
    }
}
