from rest_framework import serializers

from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from .models import (
    TipoBandaBandaEurobelt,
    MaterialBandaEurobelt,
    ColorBandaEurobelt,
    SerieBandaEurobelt,
    ComponenteBandaEurobelt,
    GrupoEnsambladoBandaEurobelt,
    CategoriaDosComponenteBandaEurobelt,
    BandaEurobelt,
    EnsambladoBandaEurobelt,
    BandaEurobeltCostoEnsamblado,
    ConfiguracionBandaEurobelt
)

from items.api_serializers import CategoriaProductoSerializer


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
    moneda_nombre = serializers.CharField(source='margen.proveedor.moneda.nombre', read_only=True)
    moneda_tasa = serializers.CharField(source='margen.proveedor.moneda.cambio', read_only=True)
    color_nombre = serializers.CharField(source='color.nombre', read_only=True)
    tipo_banda_nombre = serializers.CharField(source='tipo_banda.nombre', read_only=True)
    margen_utilidad = serializers.DecimalField(
        source='margen.margen_deseado',
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    factor_importacion = serializers.DecimalField(
        source='margen.proveedor.factor_importacion',
        read_only=True,
        decimal_places=2,
        max_digits=10
    )

    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    def create(self, validated_data):
        from .services import componente_banda_eurobelt_crear_actualizar
        referencia = validated_data.get('referencia', None)
        categoria = validated_data.get('categoria', None)
        categoria_dos = validated_data.get('categoria_dos', None)
        material = validated_data.get('material', None)
        color = validated_data.get('color', None)
        tipo_banda = validated_data.get('tipo_banda', None)
        ancho = validated_data.get('ancho', None)
        alto = validated_data.get('alto', None)
        largo = validated_data.get('largo', None)
        diametro = validated_data.get('diametro', None)
        costo = validated_data.get('costo', None)
        descripcion_adicional = validated_data.get('descripcion_adicional', None)
        componente = componente_banda_eurobelt_crear_actualizar(
            descripcion_adicional=descripcion_adicional,
            referencia=referencia,
            categoria_id=categoria.id,
            categoria_dos_id=categoria_dos.id,
            material_id=material.id,
            color_id=color.id,
            tipo_banda_id=tipo_banda.id,
            ancho=ancho,
            alto=alto,
            largo=largo,
            diametro=diametro,
            costo=costo
        )
        return componente

    def update(self, instance, validated_data):
        from .services import componente_banda_eurobelt_crear_actualizar
        referencia = validated_data.get('referencia', None)
        categoria = validated_data.get('categoria', None)
        categoria_dos = validated_data.get('categoria_dos', None)
        material = validated_data.get('material', None)
        color = validated_data.get('color', None)
        tipo_banda = validated_data.get('tipo_banda', None)
        ancho = validated_data.get('ancho', None)
        alto = validated_data.get('alto', None)
        largo = validated_data.get('largo', None)
        diametro = validated_data.get('diametro', None)
        costo = validated_data.get('costo', None)
        descripcion_adicional = validated_data.get('descripcion_adicional', None)
        componente = componente_banda_eurobelt_crear_actualizar(
            descripcion_adicional=descripcion_adicional,
            componente_id=instance.id,
            referencia=referencia,
            categoria_id=categoria.id,
            categoria_dos_id=categoria_dos.id,
            material_id=material.id,
            color_id=color.id,
            tipo_banda_id=tipo_banda.id,
            ancho=ancho,
            alto=alto,
            largo=largo,
            diametro=diametro,
            costo=costo
        )
        return componente

    class Meta:
        model = ComponenteBandaEurobelt
        fields = [
            'url',
            'id',
            'descripcion_adicional',
            'moneda_nombre',
            'nombre',
            'moneda_tasa',
            'margen_utilidad',
            'categoria',
            'categoria_dos',
            'material',
            'material_nombre',
            'precio_base',
            'precio_base_aereo',
            'rentabilidad',
            'factor_importacion',
            'costo_cop',
            'costo_cop_aereo',
            'color',
            'color_nombre',
            'to_string',
            'tipo_banda',
            'tipo_banda_nombre',
            'ancho',
            'referencia',
            'alto',
            'largo',
            'diametro',
            'series_compatibles',
            'item_cguno',
            'costo',
        ]
        extra_kwargs = {
            'nombre': {'read_only': True},
            'item_cguno': {'allow_null': True},
            'descripcion_adicional': {'allow_null': True, 'allow_blank': True}
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


class BandaEurobeltCostoEnsambladoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BandaEurobeltCostoEnsamblado
        fields = [
            'url',
            'id',
            'con_aleta',
            'con_empujador',
            'con_torneado',
            'porcentaje',
        ]


class ConfiguracionBandaEurobeltSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionBandaEurobelt
        fields = [
            'url',
            'id',
            'fabricante',
            'categoria_aleta',
            'categoria_empujador',
            'categoria_varilla',
            'categoria_banda',
            'categoria_tapa',
            'categoria_modulo',
        ]


class EnsambladoBandaEurobeltSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnsambladoBandaEurobelt
        fields = [
            'url',
            'id',
            'banda',
            'componente',
            'cortado_a',
            'cantidad',
            'created_by',
            'updated_by',
        ]


class BandaEurobeltSerializer(serializers.ModelSerializer):
    class Meta:
        model = BandaEurobelt
        fields = [
            'url',
            'id',
            'costo_ensamblado',
            'serie',
            'color',
            'ancho',
            'largo',
            'ensamblado',
            'con_torneado_varilla',
            'empujador_tipo',
            'empujador_alto',
            'empujador_ancho',
            'empujador_distanciado',
            'empujador_identacion',
            'empujador_filas_entre_empujador',
            'empujador_filas_empujador',
            'aleta_alto',
            'aleta_identacion',
        ]


class BandaEurobeltConDetalleSerializer(BandaEurobeltSerializer):
    ensamblado = EnsambladoBandaEurobeltSerializer(many=True, read_only=True)
