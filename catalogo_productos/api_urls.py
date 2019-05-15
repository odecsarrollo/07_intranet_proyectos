from rest_framework import routers
from .api_views import (
    ItemVentaCatalogoViewSet
)

router = routers.DefaultRouter()
router.register(r'catalogos_productos_items_ventas_catalogos', ItemVentaCatalogoViewSet)
