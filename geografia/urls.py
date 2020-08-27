from rest_framework import routers
from .views import (
    PaisViewSet,
    DepartamentoViewSet,
    CiudadViewSet
)

router = routers.DefaultRouter()
router.register(r'geografia_paises', PaisViewSet)
router.register(r'geografia_departamentos', DepartamentoViewSet)
router.register(r'geografia_ciudades', CiudadViewSet)
