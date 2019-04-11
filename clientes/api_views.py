from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import (
    ClienteBiable,
    ContactoCliente,
    TipoIndustria,
    CanalDistribucion
)
from .api_serializers import (
    ClienteSerializer,
    ContactoClienteSerializer,
    TipoIndustriaSerializer,
    CanalDistribucionSerializer
)


class TipoIndustriaViewSet(viewsets.ModelViewSet):
    queryset = TipoIndustria.objects.all()
    serializer_class = TipoIndustriaSerializer


class CanalDistribucionViewSet(viewsets.ModelViewSet):
    queryset = CanalDistribucion.objects.all()
    serializer_class = CanalDistribucionSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = ClienteBiable.objects.all()
    serializer_class = ClienteSerializer


class ContactoClienteViewSet(viewsets.ModelViewSet):
    queryset = ContactoCliente.objects.select_related('creado_por').all()
    serializer_class = ContactoClienteSerializer

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @list_route(http_method_names=['get', ])
    def por_cliente(self, request):
        cliente_id = request.GET.get('cliente_id')
        lista = self.queryset.filter(cliente_id=cliente_id).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
