from rest_framework import routers
from .api_views import (
    TasaHoraViewSet,
)

router = routers.DefaultRouter()
router.register(r'tasas_hora_mano_obra', TasaHoraViewSet)
