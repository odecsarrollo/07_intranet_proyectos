from rest_framework import routers
from .views import CotizacionComponenteViewSet, ItemCotizacionComponenteViewSet

router = routers.DefaultRouter()
router.register(r'cotizaciones_componentes', CotizacionComponenteViewSet)
router.register(r'cotizaciones_componentes_items', ItemCotizacionComponenteViewSet)
