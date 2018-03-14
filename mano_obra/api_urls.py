from rest_framework import routers
from .api_views import (
    HojaTrabajoDiarioViewSet,
    HoraHojaTrabajoViewSet
)

router = routers.DefaultRouter()
router.register(r'mano_obra_hoja_trabajo', HojaTrabajoDiarioViewSet)
router.register(r'mano_obra_hoja_trabajo_horas', HoraHojaTrabajoViewSet)
