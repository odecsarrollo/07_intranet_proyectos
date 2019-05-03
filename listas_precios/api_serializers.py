from rest_framework import serializers

from .models import FormaPagoCanal


class FormaPagoCanalSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    canal_nombre = serializers.CharField(source='canal.nombre', read_only=True)

    def get_to_string(self, obj):
        return obj.forma

    class Meta:
        model = FormaPagoCanal
        fields = [
            'url',
            'id',
            'canal',
            'canal_nombre',
            'forma',
            'porcentaje',
            'to_string',
        ]
