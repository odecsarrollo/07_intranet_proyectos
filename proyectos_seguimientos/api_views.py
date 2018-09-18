from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import list_route

from .models import Fase, FaseLiteral, TareaFase
from .api_serializers import FaseLiteralSerializer, FaseSerializer, TareaFaseSerializer


class FaseViewSet(viewsets.ModelViewSet):
    queryset = Fase.objects.all()
    serializer_class = FaseSerializer


class TareaFaseViewSet(viewsets.ModelViewSet):
    queryset = TareaFase.objects.all()
    serializer_class = TareaFaseSerializer

    @list_route(http_method_names=['get', ])
    def por_fase_literal(self, request):
        id_fase_literal = self.request.GET.get('id_fase_literal')
        lista = self.get_queryset().filter(fase_literal_id=id_fase_literal).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class FaseLiteralViewSet(viewsets.ModelViewSet):
    queryset = FaseLiteral.objects.select_related('fase').all()
    serializer_class = FaseLiteralSerializer

    @list_route(http_method_names=['get', ])
    def por_literal(self, request):
        id_literal = self.request.GET.get('id_literal')
        lista = self.get_queryset().filter(literal_id=id_literal).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
