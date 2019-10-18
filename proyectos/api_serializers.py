from rest_framework import serializers

from cguno.api_serializers import ItemsLiteralBiableSerializer
from cotizaciones.models import Cotizacion
from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from mano_obra.api_serializers import HoraHojaTrabajoSerializer, HoraTrabajoColaboradorLiteralInicialSerializer
from .models import Proyecto, Literal, MiembroLiteral, ArchivoLiteral, ArchivoProyecto, FacturaLiteral


class FacturaLiteralSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacturaLiteral
        fields = [
            'id',
            'literal',
            'fecha',
            'documento',
            'concepto',
            'valor_sin_impuesto',
            'impuesto'
        ]


class ArchivoLiteralSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)

    def get_size(self, obj):
        if obj.archivo:
            return obj.archivo.size
        return None

    def get_archivo_url(self, obj):
        if obj.archivo:
            return obj.archivo.url
        return None

    def get_extension(self, obj):
        extension = obj.archivo.url.split('.')[-1]
        if obj.archivo:
            return extension.title()
        return None

    class Meta:
        model = ArchivoLiteral
        fields = [
            'url',
            'id',
            'literal',
            'created',
            'nombre_archivo',
            'extension',
            'size',
            'creado_por_username',
            'archivo',
            'archivo_url',
            'creado_por',
        ]
        extra_kwargs = {
            'created': {'read_only': True},
            'creado_por': {'read_only': True},
            'nombre_archivo': {'required': False},
        }


class ArchivoProyectoSerializer(serializers.ModelSerializer):
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    archivo_url = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    def get_size(self, obj):
        if obj.archivo:
            return obj.archivo.size
        return None

    def get_archivo_url(self, obj):
        if obj.archivo:
            return obj.archivo.url
        return None

    def get_extension(self, obj):
        extension = obj.archivo.url.split('.')[-1]
        if obj.archivo:
            return extension.title()
        return None

    class Meta:
        model = ArchivoProyecto
        fields = [
            'url',
            'id',
            'proyecto',
            'created',
            'nombre_archivo',
            'extension',
            'size',
            'creado_por_username',
            'archivo',
            'archivo_url',
            'creado_por',
        ]
        extra_kwargs = {
            'created': {'read_only': True},
            'creado_por': {'read_only': True},
            'nombre_archivo': {'required': False},
        }


class MiembroLiteralSerializer(serializers.ModelSerializer):
    usuario_username = serializers.CharField(source='usuario.username', read_only=True)
    colaborador = serializers.CharField(source='usuario.colaborador', read_only=True)
    usuario_nombres = serializers.CharField(source='usuario.first_name', read_only=True)
    usuario_apellidos = serializers.CharField(source='usuario.last_name', read_only=True)

    class Meta:
        model = MiembroLiteral
        fields = [
            'url',
            'id',
            'literal',
            'usuario',
            'usuario_username',
            'colaborador',
            'usuario_nombres',
            'usuario_apellidos',
            'puede_editar_tareas',
            'puede_eliminar_tareas',
            'puede_adicionar_tareas',
            'puede_administrar_fases',
            'puede_administrar_miembros',
        ]


class LiteralSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='proyecto.cotizacion.cliente.nombre', read_only=True)
    proyecto_abierto = serializers.BooleanField(source='proyecto.abierto', read_only=True)
    id_proyecto = serializers.CharField(source='proyecto.id_proyecto', read_only=True)
    proyecto_nombre = serializers.CharField(source='proyecto.nombre', read_only=True)
    costo_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_mano_obra_inicial = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_tareas_vencidas = serializers.IntegerField(read_only=True)
    cantidad_tareas_totales = serializers.IntegerField(read_only=True)
    cantidad_tareas_terminadas = serializers.IntegerField(read_only=True)
    cantidad_tareas_nuevas = serializers.IntegerField(read_only=True)
    cantidad_tareas_pendientes = serializers.IntegerField(read_only=True)
    cantidad_tareas_en_proceso = serializers.IntegerField(read_only=True)
    cantidad_horas_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_horas_mano_obra_inicial = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    orden_compra_nro = serializers.CharField(source='cotizacion.orden_compra_nro', read_only=True)
    orden_compra_fecha = serializers.DateField(source='cotizacion.orden_compra_fecha', read_only=True)
    fecha_entrega_pactada = serializers.DateField(source='cotizacion.fecha_entrega_pactada', read_only=True)
    valor_cliente = serializers.DecimalField(source='cotizacion.valor_orden_compra', read_only=True,
                                             max_digits=20, decimal_places=2)

    class Meta:
        model = Literal
        fields = [
            'url',
            'id',
            'id_literal',
            'cantidad_tareas_vencidas',
            'cantidad_tareas_totales',
            'cantidad_tareas_nuevas',
            'cantidad_tareas_pendientes',
            'cantidad_tareas_en_proceso',
            'cantidad_tareas_terminadas',
            'proyecto_abierto',
            'proyecto_nombre',
            'id_proyecto',
            'proyecto',
            'cliente_nombre',
            'abierto',
            'en_cguno',
            'descripcion',
            'costo_materiales',
            'costo_mano_obra',
            'costo_mano_obra_inicial',
            'cantidad_horas_mano_obra',
            'cantidad_horas_mano_obra_inicial',
            'proyecto',
            'orden_compra_nro',
            'orden_compra_fecha',
            'fecha_entrega_pactada',
            'mis_documentos',
            'mis_materiales',
            'mis_horas_trabajadas',
            'mis_horas_trabajadas_iniciales',
            'facturas',
            'valor_cliente',
        ]
        extra_kwargs = {
            'mis_materiales': {'read_only': True},
            'mis_horas_trabajadas': {'read_only': True},
            'mis_documentos': {'read_only': True},
            'mis_horas_trabajadas_iniciales': {'read_only': True},
            'facturas': {'read_only': True},
        }


class ProyectoSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    cotizacion_relacionada_id = serializers.IntegerField(write_only=True, allow_null=True, required=False)
    costo_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_horas_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_mano_obra_inicial = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_horas_mano_obra_inicial = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_presupuestado_cotizaciones = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    valor_orden_compra_cotizaciones = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_presupuestado_cotizaciones_adicional = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )
    valor_orden_compra_cotizaciones_adicional = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )
    cotizaciones_nro = serializers.SerializerMethodField()
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return '%s - %s' % (instance.id_proyecto, instance.nombre)

    def get_cotizaciones_nro(self, obj):
        return 'COLOCAR EN CODIGO SERIALIZER'

    def create(self, validated_data):
        cotizacion_relacionada_id = validated_data.pop('cotizacion_relacionada_id')
        proyecto = super().create(validated_data)
        from cotizaciones.services import cotizacion_quitar_relacionar_proyecto
        if cotizacion_relacionada_id is not None:
            cotizacion_quitar_relacionar_proyecto(
                cotizacion_id=cotizacion_relacionada_id,
                proyecto_id=proyecto.id
            )
        return proyecto

    class Meta:
        model = Proyecto
        fields = [
            'url',
            'id',
            'id_proyecto',
            'abierto',
            'costo_materiales',
            'en_cguno',
            'costo_presupuestado_cotizaciones',
            'valor_orden_compra_cotizaciones',
            'costo_presupuestado_cotizaciones_adicional',
            'valor_orden_compra_cotizaciones_adicional',
            'costo_mano_obra',
            'costo_mano_obra_inicial',
            'cantidad_horas_mano_obra',
            'cantidad_horas_mano_obra_inicial',
            'cotizaciones',
            'cotizacion_relacionada_id',
            'cotizaciones_nro',
            'mis_literales',
            'mis_documentos',
            'nombre',
            'to_string',
        ]
        extra_kwargs = {
            'mis_literales': {'read_only': True},
            'mis_documentos': {'read_only': True},
            'cotizaciones': {'read_only': True},
        }


class LiteralConDetalleSerializer(LiteralSerializer):
    mis_documentos = ArchivoLiteralSerializer(
        many=True,
        read_only=True
    )
    mis_materiales = ItemsLiteralBiableSerializer(many=True, read_only=True)
    mis_horas_trabajadas = HoraHojaTrabajoSerializer(
        many=True,
        read_only=True,
        context={
            'quitar_campos': [
                'literal_nombre',
                'literal_descripcion',
                'literal_abierto',
                'creado_por',
                'creado_por_username'
            ]
        }
    )
    mis_horas_trabajadas_iniciales = HoraTrabajoColaboradorLiteralInicialSerializer(
        many=True,
        read_only=True,
        context={
            'quitar_campos': [
                'literal_nombre',
                'literal_descripcion',
                'literal_abierto',
                'creado_por',
                'creado_por_username',
                'proyecto',
            ]
        }
    )
    facturas = FacturaLiteralSerializer(
        many=True,
        read_only=True
    )


class CotizacionAdicionalProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'created',
            'nro_cotizacion',
            'unidad_negocio',
            'fecha_entrega_pactada',
            'costo_presupuestado',
            'valor_orden_compra',
            'estado',
            'orden_compra_nro'
            'descripcion_cotizacion'
        ]


class CotizacionProyectoSerializer(serializers.ModelSerializer):
    cotizaciones_adicionales = CotizacionAdicionalProyectoSerializer(many=True, read_only=True)

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'created',
            'nro_cotizacion',
            'fecha_entrega_pactada',
            'valor_orden_compra',
            'costo_presupuestado',
            'unidad_negocio',
            'descripcion_cotizacion',
            'orden_compra_nro',
            'cotizaciones_adicionales'
        ]


class ProyectoConDetalleSerializer(ProyectoSerializer):
    mis_literales = LiteralConDetalleSerializer(many=True, read_only=True)
    mis_documentos = ArchivoProyectoSerializer(many=True, read_only=True)
    cotizaciones = CotizacionProyectoSerializer(
        many=True,
        read_only=True
    )
