from rest_framework import viewsets, serializers, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import ColaboradorBiable, ItemsLiteralBiable, ItemsBiable
from .api_serializers import ColaboradorBiableSerializer, ItemsLiteralBiableSerializer, ItemsBiableSerializer


class ColaboradorBiableViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorBiable.objects.all()
    serializer_class = ColaboradorBiableSerializer


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
