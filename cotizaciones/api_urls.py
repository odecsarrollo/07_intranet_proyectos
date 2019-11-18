from rest_framework import routers
from .api_views import (
    CotizacionViewSet,
    SeguimientoCotizacionViewSet,
    ArchivoCotizacionViewSet,
    CondicionInicioProyectoViewSet,
)

router = routers.DefaultRouter()
router.register(r'cotizaciones', CotizacionViewSet)
router.register(r'cotizaciones_condiciones_inicio_proyectos', CondicionInicioProyectoViewSet)
router.register(r'cotizaciones_seguimiento', SeguimientoCotizacionViewSet)
router.register(r'cotizaciones_archivos', ArchivoCotizacionViewSet)
