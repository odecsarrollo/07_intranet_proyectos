from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

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
    ).all()
    serializer_class = FacturalDetalleSerializer

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.queryset.prefetch_related('items__item')
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
        import datetime
        before_date = datetime.datetime.now() - datetime.timedelta(days=100)
        colaboradores = self.queryset.values_list('colaborador_id', flat=True).filter(
            tipo_documento__in=['FV', 'FEV']).distinct()
        lista = self.queryset.filter(
            Q(tipo_documento__in=['FV', 'FEV', 'NCE', 'NV']) &
            Q(fecha_documento__gte=datetime.datetime(before_date.year, before_date.month, 1).date()) &
            (Q(colaborador_id__in=colaboradores) | Q(colaborador_id__isnull=True))
        )
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def relacionar_cotizacion_componente(self, request, pk=None):
        from cotizaciones_componentes.services import relacionar_cotizacion_con_factura
        cotizacion_componente_id = request.POST.get('cotizacion_componente_id')
        accion = request.POST.get('accion')
        cotizacion, factura = relacionar_cotizacion_con_factura(
            cotizacion_componente_id=cotizacion_componente_id,
            factura_id=pk,
            accion=accion
        )
        serializer = self.get_serializer(factura)
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
