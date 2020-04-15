from rest_framework import serializers

from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from .models import ItemsLiteralDetalle, FacturaDetalle, MovimientoVentaDetalle
from cargues_catalogos.api_serializers import ItemsCatalogoSerializer
from cotizaciones_componentes.models import CotizacionComponente


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


class MovimientoVentaDetalleSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    descripcion_item = serializers.CharField(source='item.descripcion', read_only=True)
    referencia_item = serializers.CharField(source='item.id_referencia', read_only=True)
    nombre_tercero = serializers.CharField(source='item.nombre_tercero', read_only=True)
    marca = serializers.CharField(source='item.marca', read_only=True)
    factura_tipo = serializers.CharField(source='factura.tipo_documento', read_only=True)
    factura_nro = serializers.CharField(source='factura.nro_documento', read_only=True)
    factura_fecha = serializers.DateField(source='factura.fecha_documento', read_only=True)
    cliente_id = serializers.CharField(source='factura.cliente_id', read_only=True)
    cliente_nombre = serializers.CharField(source='factura.cliente.nombre', read_only=True)
    vendedor_nombre = serializers.CharField(source='factura.colaborador.nombres', read_only=True)
    vendedor_apellido = serializers.CharField(source='factura.colaborador.apellidos', read_only=True)

    class Meta:
        model = MovimientoVentaDetalle
        fields = [
            'id',
            'precio_uni',
            'cantidad',
            'descripcion_item',
            'vendedor_nombre',
            'vendedor_apellido',
            'cliente_id',
            'cliente_nombre',
            'nombre_tercero',
            'referencia_item',
            'factura',
            'factura_tipo',
            'factura_fecha',
            'marca',
            'factura_nro',
            'venta_bruta',
            'dscto_netos',
            'costo_total',
            'rentabilidad',
            'imp_netos',
            'venta_neto',
        ]
        read_only_fields = fields


class CotizacionComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CotizacionComponente
        fields = [
            'id',
            'nro_consecutivo',
        ]
        read_only_fields = fields


class FacturalDetalleSerializer(serializers.ModelSerializer):
    vendedor_nombre = serializers.CharField(source='colaborador.nombres', read_only=True)
    vendedor_apellido = serializers.CharField(source='colaborador.apellidos', read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    cliente_nit = serializers.CharField(source='cliente.nit', read_only=True)
    cotizaciones_componentes = CotizacionComponenteSerializer(many=True, read_only=True)

    class Meta:
        model = FacturaDetalle
        read_only_fields = [
            'id',
            'sistema_informacion',
            'items',
            'venta_bruta',
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
            'cotizaciones_componentes',
        ]
        fields = ['colaborador'] + read_only_fields
        extra_kwargs = {
            'items': {'read_only': True},
        }


class FacturalDetalleConDetalleSerializer(FacturalDetalleSerializer):
    items = MovimientoVentaDetalleSerializer(many=True, read_only=True, context={'quitar_campos': [
        'factura_tipo',
        'factura_nro',
        'factura_fecha',
    ]})
