from rest_framework import routers
from .api_views import (
    ProyectoViewSet,
    LiteralViewSet,
    MiembroLiteralViewSet,
    ArchivoLiteralViewSet,
    ArchivoProyectosViewSet
)

router = routers.DefaultRouter()
router.register(r'proyectos', ProyectoViewSet)
router.register(r'literales', LiteralViewSet)
router.register(r'miembros_literales', MiembroLiteralViewSet)
router.register(r'literales_archivos', ArchivoLiteralViewSet)
router.register(r'proyectos_archivos', ArchivoProyectosViewSet)
