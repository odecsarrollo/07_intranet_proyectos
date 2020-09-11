from rest_framework import routers

from .views import (
    DocumentacionAreaViewSet,
    DocumentacionProcesoViewSet
)

router = routers.DefaultRouter()
router.register(r'documentacion_areas', DocumentacionAreaViewSet)
router.register(r'documentacion_procesos', DocumentacionProcesoViewSet)
