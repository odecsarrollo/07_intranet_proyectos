from rest_framework import serializers

from .models import TipoBanda, Material, Color, Serie, Componente, GrupoEnsamblado


class TipoBandaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoBanda
        fields = [
            'url',
            'id',
            'nombre',
            'nomenclatura',
        ]


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = [
            'url',
            'id',
            'nombre',
            'nomenclatura',
        ]


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = [
            'url',
            'id',
            'nombre',
            'nomenclatura',
        ]


class SerieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Serie
        fields = [
            'url',
            'id',
            'nombre',
            'nomenclatura',
        ]


class ComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Componente
        fields = [
            'url',
            'id',
            'descripcion_adicional',
            'tipo',
            'material',
            'color',
            'tipo_banda',
            'ancho',
            'alto',
            'largo',
            'diametro_varilla',
            'series_compatibles',
            'item_cguno',
            'costo',
        ]
        extra_kwargs = {
            'descripcion_adicional': {'allow_null': True},
            'item_cguno': {'allow_null': True},
        }


class GrupoEnsambladoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoEnsamblado
        fields = [
            'url',
            'id',
            'color',
            'material',
            'serie',
            'tipo_banda',
            'componentes_compatibles',
        ]
