from rest_framework import routers
from .api_views import CorreoAplicacionViewSet

router = routers.DefaultRouter()
router.register(r'correo_servicios_correo_aplicacion', CorreoAplicacionViewSet)
