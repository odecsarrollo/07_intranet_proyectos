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
    class Meta:
        model = FaseLiteral
        fields = [
            'url',
            'id',
            'fase',
            'literal',
        ]


class TareaFaseSerializer(serializers.ModelSerializer):
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
