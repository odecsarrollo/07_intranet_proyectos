from rest_framework import routers
from .views import (
    ConfiguracionCostoViewSet,
)

router = routers.DefaultRouter()
router.register(r'configuracion_costos', ConfiguracionCostoViewSet)
