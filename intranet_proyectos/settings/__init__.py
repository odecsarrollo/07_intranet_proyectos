import os

if os.environ.get('DJANGO_CONFIGURATION') == 'Local':
    from .local import *
if os.environ.get('DJANGO_CONFIGURATION') == 'Production':
    from .production import *
