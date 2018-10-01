from rest_framework import routers
from .api_views import (
    ProyectoViewSet,
    LiteralViewSet,
    MiembroLiteralViewSet
)

router = routers.DefaultRouter()
router.register(r'proyectos', ProyectoViewSet)
router.register(r'literales', LiteralViewSet)
router.register(r'miembros_literales', MiembroLiteralViewSet)
