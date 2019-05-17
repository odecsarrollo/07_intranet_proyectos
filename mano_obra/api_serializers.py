from rest_framework import serializers

from .models import (
    HojaTrabajoDiario,
    HoraHojaTrabajo,
    HoraTrabajoColaboradorLiteralInicial
)


class HoraHojaTrabajoSerializer(serializers.ModelSerializer):
    literal_nombre = serializers.CharField(source='literal.id_literal', read_only=True)
    literal_descripcion = serializers.CharField(source='literal.descripcion', read_only=True)
    literal_abierto = serializers.BooleanField(source='literal.proyecto.abierto', read_only=True)
    proyecto = serializers.IntegerField(source='literal.proyecto_id', read_only=True)
    cantidad_horas = serializers.SerializerMethodField('numero_horas')
    horas = serializers.SerializerMethodField('numero_horas')
    tasa_valor_hora = serializers.DecimalField(source='hoja.tasa.valor_hora', decimal_places=2, max_digits=12,
                                               read_only=True)
    minutos = serializers.SerializerMethodField('numero_minutos')
    colaborador_nombre = serializers.CharField(source='hoja.colaborador.full_name', read_only=True)
    fecha = serializers.CharField(source='hoja.fecha', read_only=True)
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    centro_costo_nombre = serializers.CharField(source='hoja.tasa.centro_costo.nombre', read_only=True)

    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return '%s:%s %s' % (
            int(instance.cantidad_minutos / 60), instance.cantidad_minutos - (int(instance.cantidad_minutos / 60) * 60),
            instance.literal.descripcion)

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
            'tasa_valor_hora',
            'literal',
            'cantidad_minutos',
            'cantidad_horas',
            'costo_total',
            'centro_costo_nombre',
            'literal_nombre',
            'literal_abierto',
            'literal_descripcion',
            'proyecto',
            'fecha',
            'horas',
            'minutos',
            'verificado',
            'descripcion_tarea',
            'autogestionada',
            'colaborador_nombre',
            'creado_por_username',
            'to_string',
        ]


class HojaTrabajoDiarioSerializer(serializers.ModelSerializer):
    colaborador_nombre = serializers.CharField(source='colaborador.full_name', read_only=True)
    tasa_valor_hora = serializers.DecimalField(source='tasa.valor_hora', decimal_places=2, max_digits=12,
                                               read_only=True)
    fecha = serializers.DateTimeField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    cantidad_horas = serializers.DecimalField(decimal_places=4, max_digits=12, read_only=True)
    costo_total = serializers.DecimalField(decimal_places=4, max_digits=12, read_only=True)

    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        # Prueba cambio código
        # Prueba cambio código 2
        return instance.colaborador.full_name

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
            'to_string',
        ]


class HojaTrabajoDiarioConDetalleSerializer(HojaTrabajoDiarioSerializer):
    mis_horas_trabajadas = HoraHojaTrabajoSerializer(many=True, read_only=True)


class HoraTrabajoColaboradorLiteralInicialSerializer(serializers.ModelSerializer):
    literal_nombre = serializers.CharField(source='literal.id_literal', read_only=True)
    literal_descripcion = serializers.CharField(source='literal.descripcion', read_only=True)
    literal_abierto = serializers.BooleanField(source='literal.proyecto.abierto', read_only=True)
    proyecto = serializers.IntegerField(source='literal.proyecto_id', read_only=True)
    cantidad_horas = serializers.SerializerMethodField('numero_horas')
    horas = serializers.SerializerMethodField('numero_horas')
    minutos = serializers.SerializerMethodField('numero_minutos')
    colaborador_nombre = serializers.CharField(source='colaborador.full_name', read_only=True)
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    centro_costo_nombre = serializers.CharField(source='centro_costo.nombre', read_only=True)

    def numero_horas(self, instance):
        return int(instance.cantidad_minutos / 60)

    def numero_minutos(self, instance):
        return instance.cantidad_minutos - (int(instance.cantidad_minutos / 60) * 60)

    class Meta:
        model = HoraTrabajoColaboradorLiteralInicial
        fields = [
            'url',
            'id',
            'literal',
            'cantidad_minutos',
            'valor',
            'cantidad_horas',
            'centro_costo',
            'centro_costo_nombre',
            'literal_nombre',
            'literal_abierto',
            'literal_descripcion',
            'proyecto',
            'horas',
            'minutos',
            'colaborador',
            'colaborador_nombre',
            'creado_por_username',
        ]


class CierreCostosManoObraSerializer(serializers.ModelSerializer):
    literal_nombre = serializers.CharField(source='literal.id_literal', read_only=True)
    literal_descripcion = serializers.CharField(source='literal.descripcion', read_only=True)
    literal_abierto = serializers.BooleanField(source='literal.proyecto.abierto', read_only=True)
    proyecto = serializers.IntegerField(source='literal.proyecto_id', read_only=True)
    cantidad_horas = serializers.SerializerMethodField('numero_horas')
    horas = serializers.SerializerMethodField('numero_horas')
    minutos = serializers.SerializerMethodField('numero_minutos')
    colaborador_nombre = serializers.CharField(source='colaborador.full_name', read_only=True)
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    centro_costo_nombre = serializers.CharField(source='centro_costo.nombre', read_only=True)

    def numero_horas(self, instance):
        return int(instance.cantidad_minutos / 60)

    def numero_minutos(self, instance):
        return instance.cantidad_minutos - (int(instance.cantidad_minutos / 60) * 60)

    class Meta:
        model = HoraTrabajoColaboradorLiteralInicial
        fields = [
            'url',
            'id',
            'literal',
            'cantidad_minutos',
            'valor',
            'cantidad_horas',
            'centro_costo',
            'centro_costo_nombre',
            'literal_nombre',
            'literal_abierto',
            'literal_descripcion',
            'proyecto',
            'horas',
            'minutos',
            'colaborador',
            'colaborador_nombre',
            'creado_por_username',
        ]
