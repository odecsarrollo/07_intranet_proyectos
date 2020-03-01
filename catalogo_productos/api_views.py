from django.db.models import Q, F
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
        'margen__proveedor',
        'margen__proveedor__moneda',
        'margen__categoria',
    ).exclude(sistema_informacion=1)
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
        qs = query_varios_campos(self.queryset, search_fields, parametro).filter(
            Q(activo=True) &
            (
                    (Q(unidades_disponibles__gt=0) & Q(origen='SIS_INF'))
                    | ~Q(origen='SIS_INF')
            )
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_origen(self, request):
        origen = request.GET.get('origen')
        parametro = request.GET.get('parametro', None)
        con_costos_mayores_sistema_informacion = request.GET.get('con_costos_mayores_sistema_informacion', False)
        search_fields = ['nombre_catalogo', 'referencia_catalogo', 'proveedor_importacion__nombre']
        qs = self.queryset
        if parametro and parametro.upper() != 'TODO':
            qs = query_varios_campos(self.queryset, search_fields, parametro)
        # if con_costos_mayores_sistema_informacion:
        # qs = qs.filter(item_sistema_informacion__isnull=False)
        qs = qs.filter(origen=origen)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
