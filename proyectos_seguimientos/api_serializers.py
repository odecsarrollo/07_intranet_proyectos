from datetime import datetime

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
    responsable_nombre = serializers.CharField(source='responsable.colaborador.full_name', read_only=True)
    nro_tareas = serializers.IntegerField(read_only=True)
    nro_tareas_terminadas = serializers.IntegerField(read_only=True)
    nro_tareas_vencidas = serializers.IntegerField(read_only=True)
    fecha_limite = serializers.DateField(read_only=True)

    class Meta:
        model = FaseLiteral
        fields = [
            'url',
            'id',
            'fase',
            'responsable_nombre',
            'responsable',
            'literal',
            'fase_nombre',
            'nro_tareas',
            'nro_tareas_terminadas',
            'nro_tareas_vencidas',
            'fecha_limite',
        ]


class TareaFaseSerializer(serializers.ModelSerializer):
    fecha_limite = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    vencido = serializers.SerializerMethodField()

    def get_vencido(self, obj):
        try:
            return obj.fecha_limite < datetime.now().date() and not obj.terminado
        except TypeError:
            return False

    class Meta:
        model = TareaFase
        fields = [
            'url',
            'id',
            'fase_literal',
            'fecha_limite',
            'descripcion',
            'terminado',
            'vencido',
        ]
