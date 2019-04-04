from rest_framework import routers
from .api_views import (
    SistemasInformacionOrigenViewSet
)

router = routers.DefaultRouter()
router.register(r'sistemas_informacion_origen', SistemasInformacionOrigenViewSet)
