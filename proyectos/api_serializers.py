from rest_framework import serializers

from .models import Proyecto, Literal


class LiteralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Literal
        fields = [
            'url',
            'id',
            'id_literal',
            'descripcion',
            'costo_materiales',
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
        ]
