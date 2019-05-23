from rest_framework import serializers

from .models import(
    Etiqueta
)

class EtiquetaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.codigo

    class Meta:
        model = Etiqueta
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
            'to_string'
        ]