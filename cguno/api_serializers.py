from rest_framework import serializers

from .models import ColaboradorBiable


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
