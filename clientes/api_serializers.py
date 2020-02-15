from rest_framework import serializers

from .models import (
    ClienteBiable,
    ContactoCliente,
    CanalDistribucion,
    TipoIndustria
)


class TipoIndustriaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = TipoIndustria
        fields = [
            'url',
            'id',
            'nombre',
            'descripcion',
            'to_string',
        ]


class CanalDistribucionSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = CanalDistribucion
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
        ]


class ClienteSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = ClienteBiable
        fields = [
            'url',
            'id',
            'nit',
            'nombre',
            'sincronizado_sistemas_informacion',
            'nueva_desde_cotizacion',
            'to_string',
        ]


class ContactoClienteSerializer(serializers.ModelSerializer):
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.full_nombre

    class Meta:
        model = ContactoCliente
        fields = [
            'url',
            'id',
            'cliente',
            'nombres',
            'apellidos',
            'pais',
            'ciudad',
            'creado_por_username',
            'correo_electronico',
            'correo_electronico_2',
            'telefono',
            'telefono_2',
            'full_nombre',
            'cargo',
            'to_string',
        ]
        extra_kwargs = {
            'full_nombre': {'read_only': True},
            'correo_electronico_2': {'allow_null': True},
            'telefono': {'allow_null': True},
            'telefono_2': {'allow_null': True},
            'cargo': {'allow_null': True},
        }
