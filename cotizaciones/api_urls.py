from rest_framework import routers
from .api_views import (
    CotizacionViewSet,
    SeguimientoCotizacionViewSet,
)

router = routers.DefaultRouter()
router.register(r'cotizaciones', CotizacionViewSet)
router.register(r'cotizaciones_seguimiento', SeguimientoCotizacionViewSet)
