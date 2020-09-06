from rest_framework import routers
from .views import (
    PostventaEventoEquipoViewSet
)

router = routers.DefaultRouter()
router.register(r'postventa_ordenes_servicios', PostventaEventoEquipoViewSet)
