from rest_framework import routers
from .api_views import (
    ColaboradorBiableViewSet,
    ItemsLiteralBiableViewSet,
    ItemBiableViewSet,
)

router = routers.DefaultRouter()
router.register(r'colaboradores', ColaboradorBiableViewSet)
router.register(r'items_literales', ItemsLiteralBiableViewSet)
router.register(r'items_biable', ItemBiableViewSet)
