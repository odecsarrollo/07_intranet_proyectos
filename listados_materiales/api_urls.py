from rest_framework import routers
from .api_views import (
    ItemLiteralDisenoViewSet,
)

router = routers.DefaultRouter()
router.register(r'items_listados_materiales', ItemLiteralDisenoViewSet)
