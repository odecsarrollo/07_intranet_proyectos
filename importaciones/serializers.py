from rest_framework import serializers

from .models import MonedaCambio, ProveedorImportacion, MargenProvedor


class MonedaCambioSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = MonedaCambio
        fields = [
            'url',
            'id',
            'nombre',
            'cambio',
            'cambio_a_usd',
            'variacion',
            'variacion_usd',
            'to_string',
        ]


class ProveedorImportacionSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    moneda_nombre = serializers.CharField(source='moneda.nombre', read_only=True)

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = ProveedorImportacion
        fields = [
            'url',
            'id',
            'nombre',
            'moneda',
            'moneda_nombre',
            'factor_importacion',
            'factor_importacion_aereo',
            'to_string',
        ]


class MargenProvedorSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    def get_to_string(self, obj):
        return 'Margen para %s - %s' % (obj.proveedor.nombre, obj.categoria.nombre)

    class Meta:
        model = MargenProvedor
        fields = [
            'url',
            'id',
            'categoria',
            'categoria_nombre',
            'proveedor',
            'proveedor_nombre',
            'margen_deseado',
            'to_string',
        ]
