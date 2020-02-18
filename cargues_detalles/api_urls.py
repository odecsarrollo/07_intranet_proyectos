from rest_framework import routers
from .api_views import (
    FacturaDetalleViewSet
)

router = routers.DefaultRouter()
router.register(r'cargues_detalles_facturas', FacturaDetalleViewSet)
