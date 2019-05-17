from rest_framework import serializers

from .models import (
    ColaboradorBiable,
    ItemsLiteralBiable,
    ItemsBiable,
    ColaboradorCentroCosto,
    ColaboradorCostoMesBiable
)


class ColaboradorBiableSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    usuario_activo = serializers.BooleanField(source='usuario.is_active', read_only=True)
    cargo_descripcion = serializers.CharField(source='cargo.descripcion', read_only=True)
    cargo_tipo = serializers.CharField(source='cargo.tipo_cargo', read_only=True)
    centro_costo_nombre = serializers.CharField(source='centro_costo.nombre', read_only=True)
    centro_costo_padre_nombre = serializers.CharField(source='centro_costo.centro_costo_padre.nombre', read_only=True)

    class Meta:
        model = ColaboradorBiable
        fields = [
            'url',
            'id',
            'centro_costo_nombre',
            'centro_costo_padre_nombre',
            'centro_costo',
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
            'es_aprendiz',
            'es_cguno',
            'nro_horas_mes',
            'autogestion_horas_trabajadas',
            'porcentaje_caja_compensacion',
            'porcentaje_pension',
            'porcentaje_arl',
            'porcentaje_salud',
            'porcentaje_prestaciones_sociales',
            'base_salario',
            'auxilio_transporte',
        ]
        extra_kwargs = {'literales_autorizados': {'read_only': True}}


class ColaboradorCentroCostoSerializer(serializers.ModelSerializer):
    centro_costo_padre_nombre = serializers.CharField(source='centro_costo_padre.nombre', read_only=True)

    class Meta:
        model = ColaboradorCentroCosto
        fields = [
            'id',
            'nombre',
            'centro_costo_padre',
            'centro_costo_padre_nombre'
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


class ColaboradorCostoMesBiableSerializer(serializers.ModelSerializer):
    colaborador_nombres = serializers.CharField(source='colaborador.nombres', read_only=True)
    colaborador_apellidos = serializers.CharField(source='colaborador.apellidos', read_only=True)
    colaborador_es_cguno = serializers.BooleanField(source='colaborador.es_cguno', read_only=True)
    centro_costo_nombre = serializers.CharField(source='centro_costo.nombre', read_only=True)

    class Meta:
        model = ColaboradorCostoMesBiable
        fields = [
            'id',
            'colaborador',
            'colaborador_nombres',
            'colaborador_apellidos',
            'colaborador_es_cguno',
            'es_salario_fijo',
            'es_aprendiz',
            'centro_costo',
            'centro_costo_nombre',
            'lapso',
            'costo',
            'modificado',
            'verificado',
            'nro_horas_mes',
            'nro_horas_mes_trabajadas',
            'porcentaje_caja_compensacion',
            'porcentaje_pension',
            'porcentaje_arl',
            'porcentaje_salud',
            'porcentaje_prestaciones_sociales',
            'base_salario',
            'auxilio_transporte',
            'otro_costo',
            'valor_hora',
        ]
        extra_kwargs = {'valor_hora': {'read_only': True}}


class ItemsLiteralBiableSerializer(serializers.ModelSerializer):
    item_biable = ItemsBiableSerializer(read_only=True)

    class Meta:
        model = ItemsLiteralBiable
        fields = [
            'url',
            'id',
            'lapso',
            'literal',
            'item_biable',
            'cantidad',
            'costo_total',
        ]
