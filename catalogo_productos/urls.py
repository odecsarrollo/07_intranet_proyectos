from rest_framework import routers
from .views import (
    ItemVentaCatalogoViewSet
)

router = routers.DefaultRouter()
router.register(r'catalogos_productos_items_ventas_catalogos', ItemVentaCatalogoViewSet)
