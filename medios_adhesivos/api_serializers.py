from rest_framework import serializers

from .models import(
    Adhesivo
)

class AdhesivoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.codigo

    class Meta:
        model = Adhesivo
        fields = [
            'url',
            'id',
            'codigo',
            'alto',
            'ancho',
            'color',
            'stock_min',
            'descripcion',
            'imagen',
            'tipo',
            'to_string'
        ]