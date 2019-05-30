from rest_framework import routers
from .api_views import (
    AdhesivoViewSet,
    AdhesivoMovimientoViewSet
)

router = routers.DefaultRouter()
router.register(r'adhesivo', AdhesivoViewSet)
router.register(r'adhesivo_movimiento', AdhesivoMovimientoViewSet)