from rest_framework import serializers

from .models import (
    ItemVentaCatalogo
)


class ItemVentaCatalogoSerializer(serializers.ModelSerializer):
    costo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_cop = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    precio_base = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_cop_aereo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    precio_base_aereo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    margen_deseado = serializers.DecimalField(
        source='margen.margen_deseado',
        read_only=True,
        max_digits=12,
        decimal_places=2
    )
    moneda_nombre = serializers.CharField(
        source='margen.proveedor.moneda.nombre',
        read_only=True
    )
    moneda_tasa = serializers.DecimalField(
        source='margen.proveedor.moneda.cambio',
        read_only=True,
        max_digits=12,
        decimal_places=2
    )
    proveedor_importacion_nombre = serializers.CharField(
        source='proveedor_importacion.nombre',
        read_only=True
    )
    proveedor_importacion_fi = serializers.DecimalField(
        source='proveedor_importacion.factor_importacion',
        read_only=True,
        max_digits=12,
        decimal_places=2
    )
    proveedor_importacion_fi_aereo = serializers.DecimalField(
        source='proveedor_importacion.factor_importacion_aereo',
        read_only=True,
        max_digits=12,
        decimal_places=2
    )
    referencia = serializers.SerializerMethodField()
    nombre = serializers.SerializerMethodField()
    unidad_medida = serializers.SerializerMethodField()

    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        if obj.nombre_catalogo:
            return obj.nombre_catalogo
        elif obj.item_sistema_informacion:
            return obj.item_sistema_informacion.descripcion
        return 'ASIGNAR DESCRIPCION'

    def get_referencia(self, obj):
        if obj.referencia_catalogo:
            return obj.referencia_catalogo
        elif obj.item_sistema_informacion:
            return obj.item_sistema_informacion.id_referencia
        return 'ASIGNAR REFERENCIA'

    def get_nombre(self, obj):
        if obj.nombre_catalogo:
            return obj.nombre_catalogo
        elif obj.item_sistema_informacion:
            return obj.item_sistema_informacion.descripcion
        return 'ASIGNAR DESCRIPCION'

    def get_unidad_medida(self, obj):
        if obj.unidad_medida_catalogo:
            return obj.unidad_medida_catalogo
        elif obj.item_sistema_informacion:
            return obj.item_sistema_informacion.unidad_medida
        return 'ASIGNAR DESCRIPCION'

    class Meta:
        model = ItemVentaCatalogo
        fields = [
            'url',
            'id',
            'sistema_informacion',
            'item_sistema_informacion',
            'referencia',
            'nombre',
            # 'costo',
            'costo_catalogo',
            'moneda_nombre',
            'moneda_tasa',
            'to_string',
            'unidad_medida',
            'unidad_medida_catalogo',
            'nombre_catalogo',
            'referencia_catalogo',
            'proveedor_importacion',
            'proveedor_importacion_fi',
            'proveedor_importacion_fi_aereo',
            'proveedor_importacion_nombre',
            'margen',
            'activo',
            'origen',
            'margen_deseado',
            'costo',
            'costo_cop',
            'costo_cop_aereo',
            'precio_base',
            'precio_base_aereo',
        ]
        # extra_kwargs = {'literales_autorizados': {'read_only': True}}
