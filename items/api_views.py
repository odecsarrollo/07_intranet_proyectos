from rest_framework import viewsets
from .models import (
    CategoriaProducto
)
from .api_serializers import (
    CategoriaProductoSerializer
)


class CategoriaProductoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer
