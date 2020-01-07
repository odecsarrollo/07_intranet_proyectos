from rest_framework import serializers

from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from .models import (
    HojaTrabajoDiario,
    HoraHojaTrabajo,
    HoraTrabajoColaboradorLiteralInicial,
    DistribucionHoraHojaTrabajo)


class HoraHojaTrabajoSerializer(CustomSerializerMixin, serializers.ModelSerializer):
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


class DistribucionHoraHojaTrabajoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DistribucionHoraHojaTrabajo
        fields = [
            'url',
            'id',
            'hoja',
            'literal',
            'am2430_am0100',
            'am0100_am0130',
            'am0130_am0200',
            'am0200_am0230',
            'am0230_am0300',
            'am0300_am0330',
            'am0330_am0400',
            'am0400_am0430',
            'am0430_am0500',
            'am0500_am0530',
            'am0530_am0600',
            'am0600_am0630',
            'am0630_am0700',
            'am0700_am0730',
            'am0730_am0800',
            'am0800_am0830',
            'am0830_am0900',
            'am0900_am0930',
            'am0930_am1000',
            'am1000_am1030',
            'am1030_am1100',
            'am1100_am1130',
            'am1130_pm1200',
            'pm1200_pm1230',
            'pm1230_pm1300',
            'pm1300_pm1330',
            'pm1330_pm1400',
            'pm1400_pm1430',
            'pm1430_pm1500',
            'pm1500_pm1530',
            'pm1530_pm1600',
            'pm1600_pm1630',
            'pm1630_pm1700',
            'pm1700_pm1730',
            'pm1730_pm1800',
            'pm1800_pm1830',
            'pm1830_pm1900',
            'pm1900_pm1930',
            'pm1930_pm2000',
            'pm2000_pm2030',
            'pm2030_pm2100',
            'pm2100_pm2130',
            'pm2130_pm2200',
            'pm2200_pm2230',
            'pm2230_pm2300',
            'pm2300_pm2330',
            'pm2330_am2400',
            'am2400_am2430',
        ]


class HojaTrabajoDiarioSerializer(serializers.ModelSerializer):
    colaborador_nombre = serializers.CharField(source='colaborador.full_name', read_only=True)
    tasa_valor_hora = serializers.DecimalField(source='tasa.valor_hora', decimal_places=2, max_digits=12,
                                               read_only=True)
    fecha = serializers.DateField(format="%Y-%m-%d", input_formats=['%Y-%m-%d', 'iso-8601'])
    cantidad_horas = serializers.DecimalField(decimal_places=4, max_digits=12, read_only=True)
    costo_total = serializers.DecimalField(decimal_places=4, max_digits=12, read_only=True)

    to_string = serializers.SerializerMethodField()
    creado_por = serializers.HiddenField(default=serializers.CurrentUserDefault())

    def create(self, validated_data):
        from .services import hoja_trabajo_diario_crear
        usuario = validated_data.get('creado_por', None)
        fecha = validated_data.get('fecha', None)
        colaborador = validated_data.get('colaborador', None)
        hoja_trabajo = hoja_trabajo_diario_crear(
            colaborador_id=colaborador.id,
            fecha=fecha,
            creado_por_user_id=usuario.id
        )
        return hoja_trabajo

    def get_to_string(self, instance):
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
            'creado_por',
            'cantidad_horas',
            'colaborador',
            'colaborador_nombre',
            'mis_horas_trabajadas',
            'to_string',
        ]
        extra_kwargs = {'mis_horas_trabajadas': {'read_only': True}}


class HojaTrabajoDiarioConDetalleSerializer(HojaTrabajoDiarioSerializer):
    mis_horas_trabajadas = HoraHojaTrabajoSerializer(many=True, read_only=True)


class HoraTrabajoColaboradorLiteralInicialSerializer(CustomSerializerMixin, serializers.ModelSerializer):
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
