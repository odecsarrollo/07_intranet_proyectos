from rest_framework import routers
from .api_views import (
    MonedaCambioViewSet,
    ProveedorImportacionViewSet,
    MargenProvedorViewSet
)

router = routers.DefaultRouter()
router.register(r'importaciones_monedas_cambios', MonedaCambioViewSet)
router.register(r'importaciones_proveedores_importaciones', ProveedorImportacionViewSet)
router.register(r'importaciones_margenes_proveedores', MargenProvedorViewSet)
