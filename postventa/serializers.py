from rest_framework import serializers

from postventa.models import PostventaEventoEquipo
from postventa.models import PostventaRutinaTipoEquipo, PostventaGarantia


class PostventaRutinaTipoEquipoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.descripcion

    class Meta:
        model = PostventaRutinaTipoEquipo
        fields = [
            'id',
            'to_string',
            'descripcion',
            'mes',
        ]
        read_only_fields = fields


class PostventaEventoEquipoSerializer(serializers.ModelSerializer):
    creado_por_nombre = serializers.CharField(source='creado_por.username', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.descripcion

    class Meta:
        model = PostventaEventoEquipo
        fields = [
            'equipo',
            'descripcion',
            'fecha_solicitud',
            'fecha_inicial',
            'fecha_final',
            'tipo',
            'get_tipo_display',
            'estado',
            'get_estado_display',
            'tecnico_a_cargo',
            'creado_por',
            'creado_por_nombre',
        ]
        read_only_fields = [
            'equipo',
            'creado_por',
        ]


class PostventaGarantiaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.descripcion

    class Meta:
        model = PostventaGarantia
        fields = [
            'id',
            'to_string',
            'descripcion',
            'fecha_inicial',
            'fecha_final',
            'creado_por',
        ]
        read_only_fields = fields
