from rest_framework import serializers

from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from .models import CategoriaProducto


class CategoriaProductoSerializer(CustomSerializerMixin, serializers.ModelSerializer):
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
            'categorias_dos_eurobelt',
            #'tipos_eurobelt',
        ]
        extra_kwargs = {
            'categorias_dos_eurobelt': {'read_only': True},
            #'tipos_eurobelt': {'read_only': True},
        }
