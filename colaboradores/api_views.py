from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Colaborador
from .api_serializers import ColaboradorSerializer


class ColaboradorViewSet(viewsets.ModelViewSet):
    queryset = Colaborador.objects.all()
    serializer_class = ColaboradorSerializer

    @action(detail=False, methods=['get'])
    def vendedores(self, request):
        qs = self.queryset.filter(es_vendedor=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def crear_usuario(self, request, pk=None):
        colaborador = self.get_object()
        from .services import colaborador_crear_usuario
        colaborador = colaborador_crear_usuario(colaborador.id)
        serializer = self.get_serializer(colaborador)
        return Response(serializer.data)