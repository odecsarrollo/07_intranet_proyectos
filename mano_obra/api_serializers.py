from rest_framework import serializers

from .models import TasaHora, HojaTrabajoDiario, HoraHojaTrabajo


class TasaHoraSerializer(serializers.ModelSerializer):
    colaborador_nombre = serializers.CharField(source='colaborador.full_name', read_only=True)
    colaborador_en_proyectos = serializers.BooleanField(source='colaborador.en_proyectos', read_only=True)

    class Meta:
        model = TasaHora
        fields = [
            'url',
            'id',
            'mes',
            'ano',
            'colaborador',
            'colaborador_nombre',
            'colaborador_en_proyectos',
            'costo_hora',
        ]


class HojaTrabajoDiarioSerializer(serializers.ModelSerializer):
    colaborador_nombre = serializers.CharField(source='colaborador.full_name', read_only=True)
    tasa_valor = serializers.DecimalField(source='tasa.costo_hora', decimal_places=2, max_digits=12, read_only=True)
    fecha = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])

    class Meta:
        model = HojaTrabajoDiario
        fields = [
            'url',
            'id',
            'fecha',
            'tasa',
            'tasa_valor',
            'cantidad_minutos',
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
