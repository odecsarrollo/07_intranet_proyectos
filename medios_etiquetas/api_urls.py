from rest_framework import routers
from .api_views import (
    EtiquetaViewSet,
)

router = routers.DefaultRouter()
router.register(r'etiquetas_medios', EtiquetaViewSet)
