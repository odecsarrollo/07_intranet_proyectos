import os

if os.environ.get('DJANGO_CONFIGURATION') == 'Production':
    from .production import *
elif os.environ.get('DJANGO_CONFIGURATION') == 'Local':
    from .local import *
else:
    # Por defecto usa local para desarrollo
    from .local import *
