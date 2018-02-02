from rest_framework import routers
from .api_views import (
    ProyectoViewSet,
    LiteralViewSet
)

router = routers.DefaultRouter()
router.register(r'proyectos', ProyectoViewSet)
router.register(r'literal', LiteralViewSet)
