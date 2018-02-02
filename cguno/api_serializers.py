from rest_framework import serializers

from .models import ColaboradorBiable, ItemsLiteralBiable, ItemsBiable


class ColaboradorBiableSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColaboradorBiable
        fields = [
            'url',
            'id',
            'usuario',
            'cedula',
            'nombres',
            'apellidos',
            'en_proyectos',
            'es_cguno',
        ]


class ItemsBiableSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemsBiable
        fields = [
            'url',
            'id_item',
            'id_referencia',
            'descripcion',
            'descripcion_dos',
            'activo',
            'nombre_tercero',
            'desc_item_padre',
            'unidad_medida_inventario',
            'id_procedencia',
            'ultimo_costo'
        ]


class ItemsLiteralBiableSerializer(serializers.ModelSerializer):
    item_biable = ItemsBiableSerializer(read_only=True)

    class Meta:
        model = ItemsLiteralBiable
        fields = [
            'url',
            'id',
            'literal',
            'item_biable',
            'cantidad',
            'costo_total',
        ]
