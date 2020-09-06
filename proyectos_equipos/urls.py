from rest_framework import routers
from .views import (
    TipoEquipoViewSet,
    TipoEquipoClaseViewSet,
    EquipoProyectoViewSet
)

router = routers.DefaultRouter()
router.register(r'tipos_equipos_clases', TipoEquipoClaseViewSet)
router.register(r'tipos_equipos', TipoEquipoViewSet)
router.register(r'equipo_proyectos', EquipoProyectoViewSet)
