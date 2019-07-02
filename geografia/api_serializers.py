from rest_framework import serializers

from .models import Ciudad, Pais, Departamento


class PaisSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = Pais
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
        ]


class DepartamentoSerializer(serializers.ModelSerializer):
    pais_nombre = serializers.CharField(source='pais.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = Departamento
        fields = [
            'url',
            'id',
            'nombre',
            'pais',
            'pais_nombre',
            'to_string',
        ]


class CiudadSerializer(serializers.ModelSerializer):
    pais_nombre = serializers.CharField(source='departamento.pais.nombre', read_only=True)
    pais = serializers.IntegerField(source='departamento.pais.id', read_only=True)
    departamento_nombre = serializers.CharField(source='departamento.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = Ciudad
        fields = [
            'url',
            'id',
            'nombre',
            'departamento',
            'pais',
            'pais_nombre',
            'departamento_nombre',
            'to_string',
        ]
