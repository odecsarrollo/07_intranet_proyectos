from rest_framework import routers
from .views import (
    ClienteViewSet,
    ContactoClienteViewSet,
    CanalDistribucionViewSet,
    TipoIndustriaViewSet
)

router = routers.DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'clientes_contactos', ContactoClienteViewSet)
router.register(r'clientes_canales', CanalDistribucionViewSet)
router.register(r'clientes_tipos_industrias', TipoIndustriaViewSet)
