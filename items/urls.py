from rest_framework import routers
from .views import (
    CategoriaProductoViewSet
)

router = routers.DefaultRouter()
router.register(r'items_categorias_productos', CategoriaProductoViewSet)
