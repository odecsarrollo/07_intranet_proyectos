from .base import *

DEBUG = False
ADMINS = (
    (os.environ.get('ADMIN_NAME'), os.environ.get('ADMIN_EMAIL')),
)
MANAGERS = ADMINS

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = INSTALLED_APPS + ['storages']

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

AWS_STORAGE_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_S3_HOST = 's3-us-west-2.amazonaws.com'
AWS_IS_GZIPPED = True
AWS_S3_FILE_OVERWRITE = False

# CELERY_RESULT_BACKEND = 'django-db'
# CELERY_BROKER_URL = 'sqs://%s:%s@' % (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
# # Due to error on lib region N Virginia is used temporarily. please set it on Ireland "eu-west-1" after fix.
# CELERY_BROKER_TRANSPORT_OPTIONS = {
#     "region": "us-east-1",
#     'queue_name_prefix': 'proyectos_intranet-prod-',
#     'visibility_timeout': 360,
#     'polling_interval': 1
# }

GZIP_CONTENT_TYPES = (
    "application/atom+xml",
    "application/javascript",
    "application/json",
    "application/ld+json",
    "application/manifest+json",
    "application/rdf+xml",
    "application/rss+xml",
    "application/schema+json",
    "application/vnd.geo+json",
    "application/vnd.ms-fontobject",
    "application/x-font-ttf",
    "application/x-javascript",
    "application/x-web-app-manifest+json",
    "application/xhtml+xml",
    "application/xml",
    "font/eot",
    "font/opentype",
    "image/bmp",
    "image/svg+xml",
    "image/vnd.microsoft.icon",
    "image/x-icon",
    "text/cache-manifest",
    "text/css",
    "text/html",
    "text/javascript",
    "text/plain",
    "text/vcard",
    "text/vnd.rim.location.xloc",
    "text/vtt",
    "text/x-component",
    "text/x-cross-domain-policy",
    "text/xml"
)

AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=604800',
}

STATICFILES_LOCATION = 'static'
STATICFILES_STORAGE = 'custom_storages.StaticStorage'
STATIC_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, STATICFILES_LOCATION)

MEDIAFILES_LOCATION = 'media'
MEDIA_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, MEDIAFILES_LOCATION)
DEFAULT_FILE_STORAGE = 'custom_storages.MediaStorage'

# DATABASE_ROUTERS = ['intranet_proyectos.settings.database_router.PrimaryReplicaRouter')

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE'),
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = os.environ.get('EMAIL_HOST')

EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')

EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')

EMAIL_PORT = os.environ.get('EMAIL_PORT')

EMAIL_SUBJECT_PREFIX = '[%s] ' % 'Proyectos'

EMAIL_USE_TLS = str_to_bool(os.environ.get('EMAIL_USE_TLS'))

SERVER_EMAIL = os.environ.get("SERVER_EMAIL")

EMAIL_USE_SSL = str_to_bool(os.environ.get("EMAIL_USE_SSL"))

DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL")

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'assets/bundles/dist/',
        'STATS_FILE': os.path.join(SITE_ROOT, 'webpack-stats-prod.json'),
    }
}

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': ('knox.auth.TokenAuthentication',),
    'COERCE_DECIMAL_TO_STRING': False
}