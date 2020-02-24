from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from intranet_proyectos.utils_queryset import query_varios_campos
from .models import (
    ItemVentaCatalogo
)
from .api_serializers import (
    ItemVentaCatalogoSerializer
)


class ItemVentaCatalogoViewSet(viewsets.ModelViewSet):
    queryset = ItemVentaCatalogo.objects.select_related(
        'sistema_informacion',
        'item_sistema_informacion',
        'proveedor_importacion',
        'margen',
        'margen__proveedor',
        'margen__proveedor__moneda',
    ).exclude(sistema_informacion=1).all()
    serializer_class = ItemVentaCatalogoSerializer

    @action(detail=False, http_method_names=['get', ])
    def listar_x_parametro(self, request):
        parametro = request.GET.get('parametro')
        search_fields = ['nombre_catalogo', 'referencia_catalogo']
        qs = query_varios_campos(self.queryset, search_fields, parametro)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_parametro_activos(self, request):
        parametro = request.GET.get('parametro')
        search_fields = ['nombre_catalogo', 'referencia_catalogo']
        qs = query_varios_campos(self.queryset, search_fields, parametro).filter(activo=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_origen(self, request):
        origen = request.GET.get('origen')
        qs = self.queryset.filter(origen=origen)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
