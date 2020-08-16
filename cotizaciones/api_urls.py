from rest_framework import routers

from .api_views import (
    CotizacionViewSet,
    SeguimientoCotizacionViewSet,
    ArchivoCotizacionViewSet,
    CondicionInicioProyectoViewSet,
    CondicionInicioProyectoCotizacionViewSet,
    CotizacionPagoProyectadoAcuerdoPagoViewSet,
    CotizacionPagoProyectadoViewSet
)

router = routers.DefaultRouter()
router.register(r'cotizaciones', CotizacionViewSet)
router.register(r'cotizaciones_condiciones_inicio_proyectos_cotizaciones', CondicionInicioProyectoCotizacionViewSet)
router.register(r'cotizaciones_condiciones_inicio_proyectos', CondicionInicioProyectoViewSet)
router.register(r'cotizaciones_seguimiento', SeguimientoCotizacionViewSet)
router.register(r'cotizaciones_archivos', ArchivoCotizacionViewSet)
router.register(r'cotizaciones_ordenes_compra_acuerdos_pagos', CotizacionPagoProyectadoAcuerdoPagoViewSet)
router.register(r'cotizaciones_ordenes_compra', CotizacionPagoProyectadoViewSet)
