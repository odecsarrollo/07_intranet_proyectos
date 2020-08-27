from rest_framework import routers
from .views import (
    TipoEquipoViewSet
)

router = routers.DefaultRouter()
router.register(r'tipos_equipos', TipoEquipoViewSet)
