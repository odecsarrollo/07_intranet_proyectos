from rest_framework import serializers

from .models import ConfiguracionCosto


class ConfiguracionCostoSerializer(serializers.ModelSerializer):
    fecha_cierre = serializers.DateTimeField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%d', 'iso-8601'],
        allow_null=True,
        required=False
    )

    class Meta:
        model = ConfiguracionCosto
        fields = [
            'url',
            'id',
            'fecha_cierre',
        ]
