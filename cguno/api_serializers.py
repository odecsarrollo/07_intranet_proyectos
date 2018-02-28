from rest_framework import serializers

from .models import ColaboradorBiable, ItemsLiteralBiable, ItemsBiable


class ColaboradorBiableSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    usuario_activo = serializers.BooleanField(source='usuario.is_active', read_only=True)
    cargo_descripcion = serializers.CharField(source='cargo.descripcion', read_only=True)
    cargo_tipo = serializers.CharField(source='cargo.tipo_cargo', read_only=True)

    class Meta:
        model = ColaboradorBiable
        fields = [
            'url',
            'id',
            'cargo',
            'cargo_descripcion',
            'cargo_tipo',
            'usuario',
            'usuario_username',
            'usuario_activo',
            'cedula',
            'nombres',
            'apellidos',
            'en_proyectos',
            'es_salario_fijo',
            'es_cguno',
            'autogestion_horas_trabajadas',
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
