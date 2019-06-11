from rest_framework import serializers

from .models import (
    EquipoComputador,
    EquipoCelular,
    EquipoCelularFoto,
    EquipoComputadorFoto
)



class EquipoComputadorSerializer(serializers.ModelSerializer):

    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

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
            'descripcion',
            'marca_nombre',
            'procesador_nombre',
            'tipo_nombre',
            'estado_nombre',
            'to_string'
        ]

class EquipoCelularSerializer(serializers.ModelSerializer):

    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.referencia

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
            'descripcion',
            'marca_nombre',
            'to_string'
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