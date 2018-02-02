from rest_framework import routers
from .api_views import (
    PermissionViewSet
)

router = routers.DefaultRouter()
router.register(r'permisos', PermissionViewSet)
