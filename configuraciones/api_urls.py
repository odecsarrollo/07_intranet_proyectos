from rest_framework import routers
from .api_views import (
    ConfiguracionCostoViewSet,
)

router = routers.DefaultRouter()
router.register(r'configuracion_costos', ConfiguracionCostoViewSet)
