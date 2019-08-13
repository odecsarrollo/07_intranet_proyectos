from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import CotizacionComponente, ItemCotizacionComponente
from .api_serializers import (
    CotizacionComponenteSerializer,
    ItemCotizacionComponenteSerializer,
    CotizacionComponenteConDetalleSerializer
)


class CotizacionComponenteViewSet(viewsets.ModelViewSet):
    queryset = CotizacionComponente.objects.select_related(
        'cliente',
        'ciudad',
        'ciudad__departamento',
        'ciudad__departamento__pais',
        'contacto',
        'contacto__creado_por'
    ).prefetch_related(
        'items'
    ).all()
    serializer_class = CotizacionComponenteSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def adicionar_item(self, request, pk=None):
        cotizacion = self.get_object()
        tipo_item = request.POST.get('tipo_item')
        precio_unitario = request.POST.get('precio_unitario')
        item_descripcion = request.POST.get('item_descripcion')
        item_referencia = request.POST.get('item_referencia')
        item_unidad_medida = request.POST.get('item_unidad_medida')
        id_item = request.POST.get('id_item', None)
        forma_pago_id = request.POST.get('forma_pago_id', None)
        from .services import contizacion_componentes_adicionar_item
        cotizacion_componente = contizacion_componentes_adicionar_item(
            tipo_item=tipo_item,
            cotizacion_componente_id=cotizacion.id,
            precio_unitario=precio_unitario,
            id_item=id_item,
            item_descripcion=item_descripcion,
            item_referencia=item_referencia,
            item_unidad_medida=item_unidad_medida,
            forma_pago_id=forma_pago_id
        )
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_item(self, request, pk=None):
        cotizacion = self.get_object()
        id_item_cotizacion = request.POST.get('id_item_cotizacion')
        ItemCotizacionComponente.objects.filter(pk=id_item_cotizacion).delete()
        cotizacion = CotizacionComponente.objects.get(pk=cotizacion.id)
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)


class ItemCotizacionComponenteViewSet(viewsets.ModelViewSet):
    queryset = ItemCotizacionComponente.objects.all()
    serializer_class = ItemCotizacionComponenteSerializer
