from django.db.models import Q
from rest_framework import viewsets, serializers, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import ColaboradorBiable, ItemsLiteralBiable, ItemsBiable
from .api_serializers import ColaboradorBiableSerializer, ItemsLiteralBiableSerializer, ItemsBiableSerializer


class ColaboradorBiableViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorBiable.objects.all()
    serializer_class = ColaboradorBiableSerializer

    @list_route(http_method_names=['get', ])
    def en_proyectos(self, request):
        lista = self.queryset.filter(en_proyectos=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def en_proyectos_para_gestion_horas_trabajadas(self, request):
        lista = self.queryset.filter(en_proyectos=True, autogestion_horas_trabajadas=False).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def en_proyectos_autogestion_horas_trabajadas(self, request):
        lista = self.queryset.filter(en_proyectos=True, autogestion_horas_trabajadas=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class ItemsLiteralBiableViewSet(viewsets.ModelViewSet):
    queryset = ItemsLiteralBiable.objects.select_related('item_biable').all()
    serializer_class = ItemsLiteralBiableSerializer
    http_method_names = []

    @list_route(http_method_names=['get', ])
    def listar_items_x_literal(self, request):
        literal_id = request.GET.get('id_literal')
        lista = self.queryset.filter(literal_id=literal_id).order_by('item_biable__descripcion').all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class ItemBiableViewSet(viewsets.ModelViewSet):
    queryset = ItemsBiable.objects.all()
    serializer_class = ItemsBiableSerializer
    http_method_names = ['get', ]

    @list_route(http_method_names=['get', ])
    def listar_items_x_parametro(self, request):
        parametro = request.GET.get('parametro')
        tipo_parametro = int(request.GET.get('tipo_parametro'))
        lista = None

        if (tipo_parametro == 1 and len(parametro) >= 3):
            lista = self.queryset.filter(
                Q(descripcion__icontains=parametro) |
                Q(nombre_tercero__icontains=parametro) |
                Q(descripcion_dos__icontains=parametro)
            ).all()

        if (tipo_parametro == 2 and parametro.isnumeric()):
            lista = self.queryset.filter(
                id_item=int(parametro)
            ).all()

        if (tipo_parametro == 3 and len(parametro) >= 3):
            lista = self.queryset.filter(
                id_referencia__icontains=parametro
            ).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
