from rest_framework import routers
from .api_views import (
    ColaboradorBiableViewSet
)

router = routers.DefaultRouter()
router.register(r'colaboradores', ColaboradorBiableViewSet)
