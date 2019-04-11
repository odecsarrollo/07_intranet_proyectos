from rest_framework import routers
from .api_views import (
    CiudadCatalogoViewSet
)

router = routers.DefaultRouter()
router.register(r'cargues_catalogos_ciudades', CiudadCatalogoViewSet)
