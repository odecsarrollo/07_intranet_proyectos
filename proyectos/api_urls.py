from rest_framework import routers
from .api_views import (
    ProyectoViewSet
)

router = routers.DefaultRouter()
router.register(r'proyectos', ProyectoViewSet)
