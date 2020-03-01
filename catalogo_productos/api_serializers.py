from rest_framework import serializers

from .models import (
    ItemVentaCatalogo
)


class ItemVentaCatalogoSerializer(serializers.ModelSerializer):
    costo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_cop = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    precio_base = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_cop_aereo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_a_usar = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_a_usar_aereo = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_sistema_informacion = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
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
    proveedor_importacion_fi = serializers.DecimalField(
        source='margen.proveedor.factor_importacion',
        read_only=True,
        max_digits=12,
        decimal_places=2
    )
    proveedor_importacion_fi_aereo = serializers.DecimalField(
        source='margen.proveedor.factor_importacion_aereo',
        read_only=True,
        max_digits=12,
        decimal_places=2
    )
    proveedor_nombre = serializers.CharField(
        source='margen.proveedor.nombre',
        read_only=True
    )
    categoria_nombre = serializers.CharField(
        source='margen.categoria.nombre',
        read_only=True
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
            return obj.item_sistema_informacion.unidad_medida_inventario
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
            'costo_catalogo',
            'costo_sistema_informacion',
            'moneda_nombre',
            'moneda_tasa',
            'proveedor_nombre',
            'categoria_nombre',
            'to_string',
            'unidad_medida',
            'unidad_medida_catalogo',
            'nombre_catalogo',
            'referencia_catalogo',
            'proveedor_importacion',
            'proveedor_importacion_fi',
            'proveedor_importacion_fi_aereo',
            'margen',
            'activo',
            'unidades_disponibles',
            'origen',
            'id_procedencia',
            'margen_deseado',
            'fecha_ultima_entrada',
            'costo',
            'costo_a_usar',
            'costo_a_usar_aereo',
            'costo_cop',
            'costo_cop_aereo',
            'precio_base',
            'precio_base_aereo',
        ]
