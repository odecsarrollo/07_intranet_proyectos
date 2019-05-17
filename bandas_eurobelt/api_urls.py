from rest_framework import routers
from .api_views import (
    MaterialViewSet,
    TipoBandaViewSet,
    ColorViewSet,
    SerieViewSet,
    ComponenteViewSet,
    GrupoEnsambladoViewSet,
    CategoriaDosViewSet,
    ConfiguracionNombreAutomaticoViewSet
)

router = routers.DefaultRouter()
router.register(r'banda_eurobelt_materiales', MaterialViewSet)
router.register(r'banda_eurobelt_tipos', TipoBandaViewSet)
router.register(r'banda_eurobelt_colores', ColorViewSet)
router.register(r'banda_eurobelt_series', SerieViewSet)
router.register(r'banda_eurobelt_categorias_dos', CategoriaDosViewSet)
router.register(r'banda_eurobelt_componentes', ComponenteViewSet)
router.register(r'banda_eurobelt_grupos_ensamblados', GrupoEnsambladoViewSet)
router.register(r'banda_eurobelt_configuraciones_nombres_automaticos', ConfiguracionNombreAutomaticoViewSet)
