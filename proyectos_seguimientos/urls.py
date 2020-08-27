from rest_framework import routers
from .views import (
    FaseViewSet,
    FaseLiteralViewSet,
    TareaFaseViewSet
)

router = routers.DefaultRouter()
router.register(r'fases', FaseViewSet)
router.register(r'fases_literales', FaseLiteralViewSet)
router.register(r'fases_tareas', TareaFaseViewSet)
