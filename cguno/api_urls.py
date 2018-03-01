from rest_framework import routers
from .api_views import (
    ColaboradorBiableViewSet,
    ItemsLiteralBiableViewSet,
    ItemBiableViewSet,
    ColaboradorCentroCostoViewSet
)

router = routers.DefaultRouter()
router.register(r'colaboradores', ColaboradorBiableViewSet)
router.register(r'colaboradores_centros_costos', ColaboradorCentroCostoViewSet)
router.register(r'items_literales', ItemsLiteralBiableViewSet)
router.register(r'items_biable', ItemBiableViewSet)
