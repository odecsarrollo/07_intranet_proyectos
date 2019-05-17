from django.db.models import Prefetch
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .models import (
    CategoriaProducto
)
from .api_serializers import (
    CategoriaProductoSerializer
)
from .api_serializers_con_detalle import (
    CategoriaProductoConDetalleSerializer
)


class CategoriaProductoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProducto.objects.prefetch_related(
        'categorias_dos_eurobelt',
        'tipos_eurobelt',
    ).all()
    serializer_class = CategoriaProductoSerializer

    def dispatch(self, *args, **kwargs):
        response = super().dispatch(*args, **kwargs)
        # For debugging purposes only.
        from django.db import connection
        for query in connection.queries:
            print(query['sql'])
        return response

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CategoriaProductoConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CategoriaProductoConDetalleSerializer
        return super().update(request, *args, **kwargs)

    @detail_route(methods=['post'])
    def adicionar_quitar_categoria_dos_banda_eurobelt(self, request, pk=None):
        from .services import categoria_producto_adicionar_quitar_relacion_categorias_dos_banda_eurobelt
        categoria_producto = self.get_object()
        categoria_dos_id = self.request.POST.get('categoria_dos_id', None)
        categoria_producto = categoria_producto_adicionar_quitar_relacion_categorias_dos_banda_eurobelt(
            categoria_producto_id=categoria_producto.id,
            categoria_dos_id=categoria_dos_id
        )
        self.serializer_class = CategoriaProductoConDetalleSerializer
        serializer = self.get_serializer(categoria_producto)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def adicionar_quitar_tipo_banda_eurobelt(self, request, pk=None):
        from .services import categoria_producto_adicionar_quitar_relacion_tipo_banda_eurobelt
        categoria_producto = self.get_object()
        tipo_banda_id = self.request.POST.get('tipo_banda_id', None)
        categoria_producto = categoria_producto_adicionar_quitar_relacion_tipo_banda_eurobelt(
            categoria_producto_id=categoria_producto.id,
            tipo_banda_id=tipo_banda_id
        )
        self.serializer_class = CategoriaProductoConDetalleSerializer
        serializer = self.get_serializer(categoria_producto)
        return Response(serializer.data)
