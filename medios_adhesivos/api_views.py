from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import (
    Adhesivo,
    AdhesivoMovimiento
)

from .api_serializers import (
    AdhesivoSerializer,
    MovimientoAdhesivoSerializer
)


class AdhesivoViewSet(viewsets.ModelViewSet):
    queryset = Adhesivo.objects.all()
    serializer_class = AdhesivoSerializer

    @list_route(http_method_names=['get', ])
    def listar_adhesivos_x_tipo(self, request):
        tipo = request.GET.get('tipo')
        qs = self.queryset.filter(tipo=tipo)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class AdhesivoMovimientoViewSet(viewsets.ModelViewSet):
    queryset = AdhesivoMovimiento.objects.select_related('adhesivo').all()
    serializer_class = MovimientoAdhesivoSerializer
