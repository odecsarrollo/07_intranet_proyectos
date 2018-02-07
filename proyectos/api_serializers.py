from rest_framework import serializers

from .models import Proyecto, Literal


class LiteralSerializer(serializers.ModelSerializer):
    abierto = serializers.BooleanField(source='proyecto.abierto', read_only=True)

    class Meta:
        model = Literal
        fields = [
            'url',
            'id',
            'id_literal',
            'abierto',
            'descripcion',
            'costo_materiales',
            'costo_mano_obra'
        ]


class ProyectoSerializer(serializers.ModelSerializer):
    mis_literales = LiteralSerializer(many=True, read_only=True)

    class Meta:
        model = Proyecto
        fields = [
            'url',
            'id',
            'id_proyecto',
            'fecha_prometida',
            'abierto',
            'costo_materiales',
            'mis_literales',
            'valor_cliente',
            'costo_presupuestado',
            'costo_mano_obra'
        ]
