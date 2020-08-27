from rest_framework import serializers

from .models import (
    Colaborador
)


class ColaboradorSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    usuario_activo = serializers.BooleanField(source='usuario.is_active', read_only=True)

    def get_to_string(self, instance):
        return '%s %s' % (instance.nombres, instance.apellidos)

    class Meta:
        model = Colaborador
        fields = [
            'url',
            'id',
            'to_string',
            'usuario',
            'usuario_username',
            'usuario_activo',
            'nro_contacto',
            'alias_correo',
            'cedula',
            'nombres',
            'apellidos',
            'es_vendedor',
            'en_proyectos',
            'es_salario_fijo',
            'es_aprendiz',
            'nro_horas_mes',
            'autogestion_horas_trabajadas',
            'porcentaje_caja_compensacion',
            'porcentaje_pension',
            'porcentaje_arl',
            'porcentaje_salud',
            'porcentaje_prestaciones_sociales',
            'base_salario',
            'auxilio_transporte',
        ]
