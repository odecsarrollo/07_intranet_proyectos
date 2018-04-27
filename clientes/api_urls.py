from rest_framework import routers
from .api_views import (
    ClienteViewSet,
)

router = routers.DefaultRouter()
router.register(r'clientes', ClienteViewSet)
