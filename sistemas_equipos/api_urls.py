from rest_framework import routers
from .api_views import (
    EquipoComputadorViewSet,
    EquipoCelularViewSet,
    EquipoComputadorFotoViewSet,
    EquipoCelularFotoViewSet
)

router = routers.DefaultRouter()
router.register(r'computador', EquipoComputadorViewSet)
router.register(r'celular', EquipoCelularViewSet)
router.register(r'computador_foto', EquipoComputadorFotoViewSet)
router.register(r'celular_foto', EquipoCelularFotoViewSet)