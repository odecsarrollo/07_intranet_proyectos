from rest_framework import serializers

from .models import ClienteBiable, ContactoCliente


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClienteBiable
        fields = [
            'url',
            'id',
            'nit',
            'nombre',
        ]


class ContactoClienteSerializer(serializers.ModelSerializer):
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)

    class Meta:
        model = ContactoCliente
        fields = [
            'url',
            'id',
            'cliente',
            'nombres',
            'apellidos',
            'creado_por_username',
            'correo_electronico',
            'correo_electronico_2',
            'telefono',
            'telefono_2',
            'full_nombre',
            'cargo',
        ]
        extra_kwargs = {
            'full_nombre': {'read_only': True},
            'correo_electronico_2': {'read_only': True},
            'telefono': {'read_only': True},
            'telefono_2': {'read_only': True},
            'cargo': {'read_only': True},
        }
