from math import ceil

from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import (
    FacturaDetalle,
    MovimientoVentaDetalle
)
from .api_serializers import (
    FacturalDetalleSerializer,
    FacturalDetalleConDetalleSerializer,
    MovimientoVentaDetalleSerializer
)


class FacturaDetalleViewSet(viewsets.ModelViewSet):
    queryset = FacturaDetalle.objects.select_related(
        'cliente',
        'colaborador',
    ).prefetch_related(
        'items'
    ).all()
    serializer_class = FacturalDetalleSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = FacturalDetalleConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, http_method_names=['get', ])
    def facturas_por_cliente(self, request):
        cliente_id = self.request.GET.get('cliente_id')
        lista = self.queryset.filter(cliente_id=cliente_id)
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def facturacion_componentes_trimestre(self, request):
        current_date = timezone.datetime.now()
        current_quarter = int(ceil(current_date.month / 3))
        colaboradores = self.queryset.values_list('colaborador_id', flat=True).filter(
            tipo_documento__in=['FV', 'FEV']).distinct()
        lista = self.queryset.filter(
            Q(tipo_documento__in=['FV', 'FEV', 'NCE', 'NV']) &
            (Q(colaborador_id__in=colaboradores) | Q(colaborador_id__isnull=True))
        )
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class MovimientoVentaDetalleViewSet(viewsets.ModelViewSet):
    queryset = MovimientoVentaDetalle.objects.select_related(
        'item',
        'factura'
    ).all()
    serializer_class = MovimientoVentaDetalleSerializer

    @action(detail=False, http_method_names=['get', ])
    def items_por_cliente_historico(self, request):
        cliente_id = self.request.GET.get('cliente_id')
        parametro = self.request.GET.get('parametro')
        lista = self.queryset.filter(
            Q(factura__cliente_id=cliente_id) &
            (Q(item__id_referencia__icontains=parametro) | Q(item__descripcion__icontains=parametro))
        ).distinct()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
