from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import Proyecto, Literal
from .api_serializers import ProyectoSerializer, LiteralSerializer


class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.prefetch_related('mis_literales').all()
    serializer_class = ProyectoSerializer

    @list_route(http_method_names=['get', ])
    def abiertos(self, request):
        lista = self.queryset.filter(abierto=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class LiteralViewSet(viewsets.ModelViewSet):
    queryset = Literal.objects.select_related(
        'proyecto'
    ).all()
    serializer_class = LiteralSerializer

    @list_route(http_method_names=['get', ])
    def abiertos(self, request):
        lista = self.queryset.filter(proyecto__abierto=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
