from rest_framework import routers
from .views import (
    FormaPagoCanalViewSet
)

router = routers.DefaultRouter()
router.register(r'listas_precios_formas_pagos', FormaPagoCanalViewSet)
