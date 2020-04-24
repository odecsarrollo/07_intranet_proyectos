import os
if os.environ['DJANGO_CONFIGURATION'] == 'Local':
    from .local import *
if os.environ['DJANGO_CONFIGURATION'] == 'Production':
    from .production import *
