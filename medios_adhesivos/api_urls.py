from rest_framework import routers
from .api_views import (
    AdhesivoViewSet
)

router = routers.DefaultRouter()
router.register(r'adhesivo', AdhesivoViewSet)
