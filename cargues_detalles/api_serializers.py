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
    descripcion_item = serializers.CharField(source='item.descripcion', read_only=True)
    referencia_item = serializers.CharField(source='item.id_referencia', read_only=True)
    factura_tipo = serializers.CharField(source='factura.tipo_documento', read_only=True)
    factura_nro = serializers.CharField(source='factura.nro_documento', read_only=True)
    factura_fecha = serializers.CharField(source='factura.fecha_documento', read_only=True)

    class Meta:
        model = MovimientoVentaDetalle
        fields = [
            'id',
            'precio_uni',
            'cantidad',
            'descripcion_item',
            'referencia_item',
            'factura',
            'factura_tipo',
            'factura_fecha',
            'factura_nro',
            'venta_bruta',
            'dscto_netos',
            'costo_total',
            'rentabilidad',
            'imp_netos',
            'venta_neto',
        ]
        read_only_fields = fields


class FacturalDetalleSerializer(serializers.ModelSerializer):
    vendedor_nombre = serializers.CharField(source='colaborador.nombres', read_only=True)
    vendedor_apellido = serializers.CharField(source='colaborador.apellidos', read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    cliente_nit = serializers.CharField(source='cliente.nit', read_only=True)

    class Meta:
        model = FacturaDetalle
        fields = [
            'id',
            'sistema_informacion',
            'items',
            'venta_bruta',
            'colaborador',
            'dscto_netos',
            'vendedor_nombre',
            'vendedor_apellido',
            'costo_total',
            'rentabilidad',
            'fecha_documento',
            'imp_netos',
            'venta_neto',
            'tipo_documento',
            'nro_documento',
            'cliente',
            'cliente_nit',
            'cliente_nombre',
        ]


class FacturalDetalleConDetalleSerializer(FacturalDetalleSerializer):
    items = MovimientoVentaDetalleSerializer(many=True, read_only=True)
