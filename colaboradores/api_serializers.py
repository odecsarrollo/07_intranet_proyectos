from rest_framework import serializers

from .models import (
    Colaborador
)


class ColaboradorSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return '%s %s' % (instance.nombres, instance.apellidos)

    class Meta:
        model = Colaborador
        fields = [
            'url',
            'id',
            'to_string',
            'es_vendedor'
        ]
