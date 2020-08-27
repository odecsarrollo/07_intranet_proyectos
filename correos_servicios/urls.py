from rest_framework import routers
from .views import CorreoAplicacionViewSet

router = routers.DefaultRouter()
router.register(r'correo_servicios_correo_aplicacion', CorreoAplicacionViewSet)
