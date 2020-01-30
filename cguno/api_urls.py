from rest_framework import routers
from .api_views import (
    ColaboradorBiableViewSet,
    ColaboradorCentroCostoViewSet,
    ColaboradorCostoMesBiableViewSet
)

router = routers.DefaultRouter()
router.register(r'colaboradores', ColaboradorBiableViewSet)
router.register(r'colaboradores_centros_costos', ColaboradorCentroCostoViewSet)
router.register(r'colaboradores_costo_nomina', ColaboradorCostoMesBiableViewSet)
