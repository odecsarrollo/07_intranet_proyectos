from rest_framework import serializers

from .models import CategoriaProducto


class CategoriaProductoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = CategoriaProducto
        fields = [
            'url',
            'id',
            'nombre',
            'nomenclatura',
            'to_string',
        ]
