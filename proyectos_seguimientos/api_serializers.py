from rest_framework import serializers

from .models import Fase, TareaFase, FaseLiteral


class FaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fase
        fields = [
            'url',
            'id',
            'nombre'
        ]


class FaseLiteralSerializer(serializers.ModelSerializer):
    fase_nombre = serializers.CharField(source='fase.nombre', read_only=True)

    class Meta:
        model = FaseLiteral
        fields = [
            'url',
            'id',
            'fase',
            'literal',
            'fase_nombre',
        ]


class TareaFaseSerializer(serializers.ModelSerializer):
    fecha_limite = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    class Meta:
        model = TareaFase
        fields = [
            'url',
            'id',
            'fase_literal',
            'fecha_limite',
            'descripcion',
            'terminado',
        ]
