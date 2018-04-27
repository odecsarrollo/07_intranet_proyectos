from rest_framework import serializers

from .models import ClienteBiable


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClienteBiable
        fields = [
            'url',
            'id',
            'nit',
            'nombre',
        ]
