from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    FacturaDetalle,
    MovimientoVentaDetalle
)
from .api_serializers import (
    FacturalDetalleSerializer,
    MovimientoVentaDetalleSerializer
)


class FacturaDetalleViewSet(viewsets.ModelViewSet):
    queryset = FacturaDetalle.objects.select_related(
        'cliente'
    ).prefetch_related(
        'items'
    ).all()
    serializer_class = FacturalDetalleSerializer

    @action(detail=False, http_method_names=['get', ])
    def facturas_por_cliente(self, request):
        cliente_id = self.request.GET.get('cliente_id')
        lista = self.queryset.filter(cliente_id=cliente_id)
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class MovimientoVentaDetalleViewSet(viewsets.ModelViewSet):
    queryset = MovimientoVentaDetalle.objects.select_related(
        'item'
    ).all()
    serializer_class = MovimientoVentaDetalleSerializer

    @action(detail=False, http_method_names=['get', ])
    def items_por_cliente_por_codigo(self, request):
        cliente_id = self.request.GET.get('cliente_id')
        item_id = self.request.GET.get('item_id')
        lista = self.queryset.filter(cliente_id=cliente_id, item_id=item_id)
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
