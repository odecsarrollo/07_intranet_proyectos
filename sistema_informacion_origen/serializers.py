from rest_framework import serializers

from .models import SistemaInformacionOrigen


class SistemaInformacionOrigenSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = SistemaInformacionOrigen
        fields = [
            'url',
            'id',
            'nombre',
            'codigo_amarre',
            'to_string',
        ]
