from rest_framework import routers
from .views import (
    PermissionViewSet,
    GroupViewSet
)

router = routers.DefaultRouter()
router.register(r'permisos', PermissionViewSet)
router.register(r'grupos_permisos', GroupViewSet)
