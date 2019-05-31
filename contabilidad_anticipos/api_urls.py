from rest_framework import routers
from .api_views import (
    ProformaConfiguracionViewSet,
    ProformaAnticipoViewSet,
    ProformaAnticipoItemViewSet
)

router = routers.DefaultRouter()
router.register(r'contabilidad_anticipos_proforma_anticipo_configuracion', ProformaConfiguracionViewSet)
router.register(r'contabilidad_anticipos_proformas_anticipos', ProformaAnticipoViewSet)
router.register(r'contabilidad_anticipos_proformas_anticipos_items', ProformaAnticipoItemViewSet)
