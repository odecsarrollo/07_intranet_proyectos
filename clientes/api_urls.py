from rest_framework import routers
from .api_views import (
    ClienteViewSet,
    ContactoClienteViewSet,
)

router = routers.DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'clientes_contactos', ContactoClienteViewSet)
