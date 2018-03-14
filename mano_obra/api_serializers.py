from decimal import Decimal
from rest_framework import serializers

from .models import HojaTrabajoDiario, HoraHojaTrabajo


class HojaTrabajoDiarioSerializer(serializers.ModelSerializer):
    colaborador_nombre = serializers.CharField(source='colaborador.full_name', read_only=True)
    tasa_valor_hora = serializers.DecimalField(source='tasa.valor_hora', decimal_places=2, max_digits=12,
                                               read_only=True)
    fecha = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    cantidad_horas = serializers.SerializerMethodField('numero_horas')

    def numero_horas(self, instance):
        return Decimal(instance.cantidad_minutos / 60)

    class Meta:
        model = HojaTrabajoDiario
        fields = [
            'url',
            'id',
            'fecha',
            'tasa',
            'tasa_valor_hora',
            'cantidad_minutos',
            'cantidad_horas',
            'costo_total',
            'colaborador',
            'colaborador_nombre',
        ]


class HoraHojaTrabajoSerializer(serializers.ModelSerializer):
    literal_nombre = serializers.CharField(source='literal.id_literal', read_only=True)
    literal_descripcion = serializers.CharField(source='literal.descripcion', read_only=True)
    literal_abierto = serializers.BooleanField(source='literal.proyecto.abierto', read_only=True)
    proyecto = serializers.IntegerField(source='literal.proyecto_id', read_only=True)

    class Meta:
        model = HoraHojaTrabajo
        fields = [
            'url',
            'id',
            'hoja',
            'literal',
            'cantidad_minutos',
            'costo_total',
            'literal_nombre',
            'literal_abierto',
            'literal_descripcion',
            'proyecto'
        ]
