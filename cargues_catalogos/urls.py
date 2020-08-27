from rest_framework import routers
from .views import (
    CiudadCatalogoViewSet,
    SeguimientoCargueViewSet,
    SeguimientoCargueProcedimientoViewSet,
    UnidadMedidaCatalogoViewSet
)

router = routers.DefaultRouter()
router.register(r'cargues_catalogos_ciudades', CiudadCatalogoViewSet)
router.register(r'cargues_catalogos_unidades_medidas', UnidadMedidaCatalogoViewSet)
router.register(r'cargues_catalogos_seguimientos_cargues', SeguimientoCargueViewSet)
router.register(r'cargues_catalogos_seguimientos_cargues_procedimientos', SeguimientoCargueProcedimientoViewSet)
