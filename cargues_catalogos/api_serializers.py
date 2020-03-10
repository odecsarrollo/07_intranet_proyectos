from rest_framework import serializers

from .models import (
    CiudadCatalogo,
    ItemsCatalogo,
    SeguimientoCargue,
    SeguimientoCargueProcedimiento,
    UnidadMedidaCatalogo
)


class UnidadMedidaCatalogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadMedidaCatalogo
        fields = [
            'id',
            'descripcion',
            'nomenclatura',
            'decimales',
            'sincronizado_sistema_informacion',
        ]


class SeguimientoCargueProcedimientoSerializer(serializers.ModelSerializer):
    tiempo = serializers.SerializerMethodField()

    def get_tiempo(self, obj):
        if obj.fecha_final:
            return (obj.fecha_final - obj.fecha).total_seconds() / 60.0
        return None

    class Meta:
        model = SeguimientoCargueProcedimiento
        fields = [
            'id',
            'procedimiento_nombre',
            'tabla',
            'tarea',
            'tiempo',
            'fecha',
            'fecha_final',
            'numero_filas',
        ]
        read_only_fields = fields


class SeguimientoCargueSerializer(serializers.ModelSerializer):
    procedimientos = SeguimientoCargueProcedimientoSerializer(many=True)
    tiempo = serializers.SerializerMethodField()

    def get_tiempo(self, obj):
        if obj.fecha_final:
            return (obj.fecha_final - obj.fecha).total_seconds() / 60.0
        return None

    class Meta:
        model = SeguimientoCargue
        fields = [
            'id',
            'fecha',
            'fecha_final',
            'procedimientos',
            'tiempo',
        ]
        read_only_fields = fields


class ItemsCatalogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemsCatalogo
        fields = [
            'id_item',
            'id_referencia',
            'descripcion',
            'descripcion_dos',
            'activo',
            'nombre_tercero',
            'desc_item_padre',
            'unidad_medida_inventario',
            'id_procedencia',
            'ultimo_costo',
            'sistema_informacion',
        ]


class CiudadCatalogoSerializer(serializers.ModelSerializer):
    sistema_informacion_nombre = serializers.CharField(source='sistema_informacion.nombre', read_only=True)
    departamento_intranet_nombre = serializers.CharField(source='ciudad_intranet.departamento.nombre', read_only=True)
    ciudad_intranet_nombre = serializers.CharField(source='ciudad_intranet.nombre', read_only=True)
    departamento_nombre = serializers.CharField(source='departamento.nombre', read_only=True)
    pais_nombre = serializers.CharField(source='departamento.pais.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = CiudadCatalogo
        fields = [
            'url',
            'id',
            'nombre',
            'ciudad_intranet',
            'ciudad_intranet_nombre',
            'departamento_intranet_nombre',
            'sistema_informacion_nombre',
            'departamento',
            'pais_nombre',
            'departamento_nombre',
            'to_string',
        ]
