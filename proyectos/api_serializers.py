from rest_framework import serializers

from .models import Proyecto, Literal


class LiteralSerializer(serializers.ModelSerializer):
    abierto = serializers.BooleanField(source='proyecto.abierto', read_only=True)
    costo_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_horas_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Literal
        fields = [
            'url',
            'id',
            'id_literal',
            'abierto',
            'descripcion',
            'costo_materiales',
            'costo_mano_obra',
            'cantidad_horas_mano_obra',
            'proyecto',
        ]


class ProyectoSerializer(serializers.ModelSerializer):
    mis_literales = LiteralSerializer(many=True, read_only=True)
    costo_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_horas_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Proyecto
        fields = [
            'url',
            'id',
            'id_proyecto',
            'fecha_prometida',
            'abierto',
            'costo_materiales',
            'valor_cliente',
            'costo_presupuestado',
            'costo_mano_obra',
            'cantidad_horas_mano_obra',
            'mis_literales',
        ]
