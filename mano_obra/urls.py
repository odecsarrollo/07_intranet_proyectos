from rest_framework import routers
from .views import (
    HojaTrabajoDiarioViewSet,
    HoraHojaTrabajoViewSet,
    HoraTrabajoColaboradorLiteralInicialViewSet
)

router = routers.DefaultRouter()
router.register(r'mano_obra_hoja_trabajo', HojaTrabajoDiarioViewSet)
router.register(r'mano_obra_hoja_trabajo_horas', HoraHojaTrabajoViewSet)
router.register(r'mano_obra_hoja_trabajo_horas_iniciales', HoraTrabajoColaboradorLiteralInicialViewSet)
