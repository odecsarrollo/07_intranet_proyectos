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