from rest_framework import routers
from .api_views import (
    CiudadCatalogoViewSet,
    SeguimientoCargueViewSet,
    SeguimientoCargueProcedimientoViewSet
)

router = routers.DefaultRouter()
router.register(r'cargues_catalogos_ciudades', CiudadCatalogoViewSet)
router.register(r'cargues_catalogos_seguimientos_cargues', SeguimientoCargueViewSet)
router.register(r'cargues_catalogos_seguimientos_cargues_procedimientos', SeguimientoCargueProcedimientoViewSet)
