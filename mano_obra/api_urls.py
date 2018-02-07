from rest_framework import routers
from .api_views import (
    TasaHoraViewSet,
    HojaTrabajoDiarioViewSet,
    HoraHojaTrabajoViewSet
)

router = routers.DefaultRouter()
router.register(r'tasas_hora_mano_obra', TasaHoraViewSet)
router.register(r'hojas_trabajo_diario', HojaTrabajoDiarioViewSet)
router.register(r'horas_hojas_trabajo', HoraHojaTrabajoViewSet)
