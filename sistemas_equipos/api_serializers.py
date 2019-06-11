from rest_framework import serializers

from .models import (
    EquipoComputador,
    EquipoCelular,
    EquipoCelularFoto,
    EquipoComputadorFoto
)



class EquipoComputadorSerializer(serializers.ModelSerializer):

    class Meta:
        model = EquipoComputador
        fields = [
            'id',
            'nombre',
            'marca',
            'referencia',
            'procesador',
            'tipo',
            'serial',
            'estado',
            'descripcion'
        ]

class EquipoCelularSerializer(serializers.ModelSerializer):

    class Meta:
        model = EquipoCelular
        fields = [
            'id',
            'marca',
            'referencia',
            'imei_1',
            'imei_2',
            'numero_1',
            'numero_2',
            'descripcion'
        ]


class EquipoCelularFotoSerializer(serializers.ModelSerializer):
    foto_small = serializers.ImageField(read_only=True)

    class Meta:
        model = EquipoCelularFoto
        fields = [
            'id',
            'url',
            'descripcion'
            'celular_id',
            'foto',
            'foto_small'
        ]


class EquipoComputadorFotoSerializer(serializers.ModelSerializer):
    foto_small = serializers.ImageField(read_only=True)

    class Meta:
        model = EquipoComputadorFoto
        fields = [
            'id',
            'url',
            'descripcion'
            'computador_id',
            'foto',
            'foto_small'
        ]