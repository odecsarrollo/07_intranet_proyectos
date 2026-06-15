from .base import *

# Producción on-prem (todo local): sin S3; estáticos vía WhiteNoise (Gunicorn no sirve /static/).
DEBUG = False

_mw = list(MIDDLEWARE)
if "whitenoise.middleware.WhiteNoiseMiddleware" not in _mw:
    # Inmediatamente después de SecurityMiddleware (requerido por WhiteNoise)
    _mw.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")
MIDDLEWARE = _mw

ADMIN_NAME = os.environ.get("ADMIN_NAME")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL")
if ADMIN_NAME and ADMIN_EMAIL:
    ADMINS = ((ADMIN_NAME, ADMIN_EMAIL),)
    MANAGERS = ADMINS

ALLOWED_HOSTS = [h.strip() for h in os.environ.get("ALLOWED_HOSTS", "").split(",") if h.strip()]
if not ALLOWED_HOSTS:
    # Fallback seguro para entornos sin dominio configurado explícitamente.
    ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")

# Base de datos (local)
DATABASES = {
    "default": {
        "ENGINE": os.environ.get("DB_ENGINE", "django.db.backends.mysql"),
        "NAME": os.environ.get("DB_NAME", "proyectos_intranet"),
        "USER": os.environ.get("DB_USER", "proyectos"),
        "PASSWORD": os.environ.get("DB_PASSWORD", ""),
        "HOST": os.environ.get("DB_HOST", "db"),
        "PORT": os.environ.get("DB_PORT", "3306"),
        "ATOMIC_REQUESTS": True,
        "OPTIONS": {"init_command": "SET sql_mode='STRICT_TRANS_TABLES'"},
    },
    "read_only": {
        "ENGINE": os.environ.get("DB_ENGINE", "django.db.backends.mysql"),
        "NAME": os.environ.get("DB_NAME", "proyectos_intranet"),
        "USER": os.environ.get("DB_USER", "proyectos"),
        "PASSWORD": os.environ.get("DB_PASSWORD", ""),
        "HOST": os.environ.get("DB_HOST_REPLICA", os.environ.get("DB_HOST", "db")),
        "PORT": os.environ.get("DB_PORT", "3306"),
        "ATOMIC_REQUESTS": True,
        "OPTIONS": {"init_command": "SET sql_mode='STRICT_TRANS_TABLES'"},
    },
}

# Email
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.environ.get("EMAIL_HOST", "")
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_PORT = os.environ.get("EMAIL_PORT", "")
EMAIL_SUBJECT_PREFIX = "[%s] " % "Proyectos"
EMAIL_USE_TLS = str_to_bool(os.environ.get("EMAIL_USE_TLS", "False"))
EMAIL_USE_SSL = str_to_bool(os.environ.get("EMAIL_USE_SSL", "False"))
SERVER_EMAIL = os.environ.get("SERVER_EMAIL", "")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "")

# Celery / Redis (local). No usar django-db como backend de resultados aquí: requeriría
# django-celery-results + migraciones; Redis evita ese fallo al arrancar el worker.
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.environ.get(
    "CELERY_RESULT_BACKEND", "redis://redis:6379/1"
)

# Static/media locales
# On-prem: Gunicorn sirve /static/ (WhiteNoise) y /media/ (SERVE_MEDIA); Nginx solo hace proxy.
# Evita 403 recurrentes cuando Podman/collectstatic dejan staticfiles/media en root:root 2770.
SERVE_MEDIA = True
STATIC_URL = "/static/"
MEDIA_URL = "/media/"
STATIC_ROOT = os.environ.get("STATIC_ROOT", os.path.join(SITE_ROOT, "staticfiles"))
MEDIA_ROOT = os.environ.get("MEDIA_ROOT", os.path.join(SITE_ROOT, "media"))
STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"

WEBPACK_LOADER = {
    "DEFAULT": {
        "BUNDLE_DIR_NAME": "assets/bundles/dist/",
        "STATS_FILE": os.path.join(SITE_ROOT, "webpack-stats-prod.json"),
    }
}

# API: JSON-only en prod
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ("rest_framework.renderers.JSONRenderer",),
    "DEFAULT_AUTHENTICATION_CLASSES": ("knox.auth.TokenAuthentication",),
    "COERCE_DECIMAL_TO_STRING": False,
}

