from rest_framework import routers
from .views import (
    SistemasInformacionOrigenViewSet
)

router = routers.DefaultRouter()
router.register(r'sistemas_informacion_origen', SistemasInformacionOrigenViewSet)
