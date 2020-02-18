from rest_framework import serializers

from .models import ItemsLiteralDetalle, FacturaDetalle, MovimientoVentaDetalle
from cargues_catalogos.api_serializers import ItemsCatalogoSerializer


class ItemsLiteralDetalleSerializer(serializers.ModelSerializer):
    item = ItemsCatalogoSerializer(read_only=True)

    class Meta:
        model = ItemsLiteralDetalle
        fields = [
            'id',
            'lapso',
            'literal',
            'item',
            'cantidad',
            'costo_total',
        ]


class MovimientoVentaDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimientoVentaDetalle
        fields = [
            'id',
            'precio_uni',
            'cantidad',
            'venta_bruta',
            'dscto_netos',
            'costo_total',
            'rentabilidad',
            'imp_netos',
            'venta_neto',
        ]


class FacturalDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacturaDetalle
        fields = [
            'id',
            'sistema_informacion',
            'venta_bruta',
            'dscto_netos',
            'costo_total',
            'rentabilidad',
            'imp_netos',
            'venta_neto',
            'tipo_documento',
            'nro_documento',
        ]
