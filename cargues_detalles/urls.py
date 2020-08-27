from rest_framework import routers
from .views import (
    FacturaDetalleViewSet,
    MovimientoVentaDetalleViewSet
)

router = routers.DefaultRouter()
router.register(r'cargues_detalles_facturas', FacturaDetalleViewSet)
router.register(r'cargues_detalles_facturas_items', MovimientoVentaDetalleViewSet)
