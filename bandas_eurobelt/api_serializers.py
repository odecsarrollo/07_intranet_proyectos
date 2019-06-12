from rest_framework import serializers

from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from .models import (
    TipoBandaBandaEurobelt,
    MaterialBandaEurobelt,
    ColorBandaEurobelt,
    SerieBandaEurobelt,
    ComponenteBandaEurobelt,
    GrupoEnsambladoBandaEurobelt,
    ConfiguracionNombreAutomatico,
    CategoriaDosComponenteBandaEurobelt
)

from items.api_serializers import CategoriaProductoSerializer


class ConfiguracionNombreAutomaticoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return 'Nombre automático para categoría %s' % instance.categoria.nombre

    class Meta:
        model = ConfiguracionNombreAutomatico
        fields = [
            'url',
            'id',
            'categoria',
            'categoria_nombre',
            'nombre_con_categoria_uno',
            'nombre_con_categoria_dos',
            'nombre_con_serie',
            'nombre_con_tipo',
            'nombre_con_material',
            'nombre_con_color',
            'nombre_con_ancho',
            'nombre_con_alto',
            'nombre_con_longitud',
            'nombre_con_diametro',
            'to_string',
        ]


class CategoriaDosSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = CategoriaDosComponenteBandaEurobelt
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
            'nomenclatura',
            'categorias',
        ]
        extra_kwargs = {'categorias': {'read_only': True}}


class CategoriaDosConDetalleSerializer(CategoriaDosSerializer):
    categorias = CategoriaProductoSerializer(
        many=True, read_only=True,
        context={'quitar_campos': ['categorias_dos_eurobelt', 'tipos_eurobelt']}
    )


class TipoBandaSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = TipoBandaBandaEurobelt
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
            'categorias',
            'nomenclatura',
        ]
        extra_kwargs = {'categorias': {'read_only': True}}


class TipoBandaConDetalleSerializer(TipoBandaSerializer):
    categorias = CategoriaProductoSerializer(
        many=True,
        read_only=True,
        context={'quitar_campos': ['categorias_dos_eurobelt', 'tipos_eurobelt']}
    )


class MaterialSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = MaterialBandaEurobelt
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
            'nomenclatura',
        ]


class ColorSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = ColorBandaEurobelt
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
            'nomenclatura',
        ]


class SerieSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = SerieBandaEurobelt
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
            'nomenclatura',
        ]


class ComponenteSerializer(serializers.ModelSerializer):
    material_nombre = serializers.CharField(source='material.nombre', read_only=True)
    moneda_nombre = serializers.CharField(source='categoria.moneda.nombre', read_only=True)
    moneda_tasa = serializers.CharField(source='categoria.moneda.cambio', read_only=True)
    color_nombre = serializers.CharField(source='color.nombre', read_only=True)
    tipo_banda_nombre = serializers.CharField(source='tipo_banda.nombre', read_only=True)
    margen_utilidad = serializers.DecimalField(
        source='categoria.margen_deseado',
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    factor_importacion = serializers.DecimalField(
        source='categoria.factor_importacion',
        read_only=True,
        decimal_places=2,
        max_digits=10
    )
    costo_cop_fact_impor = serializers.IntegerField(read_only=True)
    costo_cop_fact_impor_aereo = serializers.IntegerField(read_only=True)
    precio_base = serializers.IntegerField(read_only=True)
    rentabilidad = serializers.IntegerField(read_only=True)

    class Meta:
        model = ComponenteBandaEurobelt
        fields = [
            'url',
            'id',
            'descripcion_adicional',
            'moneda_nombre',
            'moneda_tasa',
            'margen_utilidad',
            'material',
            'material_nombre',
            'precio_base',
            'rentabilidad',
            'factor_importacion',
            'costo_cop_fact_impor',
            'costo_cop_fact_impor_aereo',
            'color',
            'color_nombre',
            'tipo_banda',
            'tipo_banda_nombre',
            'ancho',
            'referencia',
            'alto',
            'largo',
            'diametro_varilla',
            # 'series_compatibles',
            'item_cguno',
            'costo',
        ]
        extra_kwargs = {
            'descripcion_adicional': {'allow_null': True},
            'item_cguno': {'allow_null': True},
        }


class GrupoEnsambladoSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoEnsambladoBandaEurobelt
        fields = [
            'url',
            'id',
            'color',
            'material',
            'serie',
            'tipo_banda',
            'componentes_compatibles',
        ]
