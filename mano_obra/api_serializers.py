from decimal import Decimal
from rest_framework import serializers

from .models import HojaTrabajoDiario, HoraHojaTrabajo


class HoraHojaTrabajoSerializer(serializers.ModelSerializer):
    literal_nombre = serializers.CharField(source='literal.id_literal', read_only=True)
    literal_descripcion = serializers.CharField(source='literal.descripcion', read_only=True)
    literal_abierto = serializers.BooleanField(source='literal.proyecto.abierto', read_only=True)
    proyecto = serializers.IntegerField(source='literal.proyecto_id', read_only=True)
    cantidad_horas = serializers.SerializerMethodField('numero_horas')
    horas = serializers.SerializerMethodField('numero_horas')
    minutos = serializers.SerializerMethodField('numero_minutos')

    def numero_horas(self, instance):
        return int(instance.cantidad_minutos / 60)

    def numero_minutos(self, instance):
        return instance.cantidad_minutos - (int(instance.cantidad_minutos / 60) * 60)

    class Meta:
        model = HoraHojaTrabajo
        fields = [
            'url',
            'id',
            'hoja',
            'literal',
            'cantidad_minutos',
            'cantidad_horas',
            'costo_total',
            'literal_nombre',
            'literal_abierto',
            'literal_descripcion',
            'proyecto',
            'horas',
            'minutos',
        ]


class HojaTrabajoDiarioSerializer(serializers.ModelSerializer):
    colaborador_nombre = serializers.CharField(source='colaborador.full_name', read_only=True)
    tasa_valor_hora = serializers.DecimalField(source='tasa.valor_hora', decimal_places=2, max_digits=12,
                                               read_only=True)
    fecha = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    cantidad_horas = serializers.DecimalField(decimal_places=4, max_digits=12, read_only=True)
    costo_total = serializers.DecimalField(decimal_places=4, max_digits=12, read_only=True)
    mis_horas_trabajadas = HoraHojaTrabajoSerializer(many=True, read_only=True)

    class Meta:
        model = HojaTrabajoDiario
        fields = [
            'url',
            'id',
            'fecha',
            'tasa',
            'tasa_valor_hora',
            'costo_total',
            'cantidad_horas',
            'colaborador',
            'colaborador_nombre',
            'mis_horas_trabajadas',
        ]
