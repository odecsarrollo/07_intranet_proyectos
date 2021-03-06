from rest_framework import serializers

from cargues_detalles.serializers import ItemsLiteralDetalleSerializer
from cotizaciones.models import Cotizacion
from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from mano_obra.serializers import HoraHojaTrabajoSerializer, HoraTrabajoColaboradorLiteralInicialSerializer
from .models import (Proyecto,
                     Literal,
                     MiembroLiteral,
                     ArchivoLiteral,
                     ArchivoProyecto,
                     FacturaLiteral,
                     )


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
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    archivo_url = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()

    def get_size(self, obj):
        if obj.archivo:
            return obj.archivo.size
        return None

    def get_archivo_url(self, obj):
        if obj.archivo:
            return obj.archivo.url
        return None

    def get_extension(self, obj):
        if obj.archivo:
            extension = obj.archivo.url.split('.')[-1]
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
        if obj.archivo:
            extension = obj.archivo.url.split('.')[-1]
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
    fecha_entrega_pactada = serializers.DateField(source='cotizacion.fecha_entrega_pactada', read_only=True)
    valor_cliente = serializers.DecimalField(source='cotizacion.valor_orden_compra', read_only=True,
                                             max_digits=20, decimal_places=2)

    def create(self, validated_data):
        proyecto = validated_data.pop('proyecto')
        id_literal = validated_data.pop('id_literal')
        descripcion = validated_data.pop('descripcion')
        disenador = validated_data.pop('disenador', None)
        from .services import literal_crear_actualizar
        literal = literal_crear_actualizar(
            proyecto_id=proyecto.id,
            id_literal=id_literal,
            descripcion=descripcion,
            disenador_id=disenador.id if disenador is not None else None
        )
        return literal

    def update(self, instance, validated_data):
        from .services import literal_crear_actualizar
        descripcion = validated_data.pop('descripcion')
        abierto = validated_data.pop('abierto')
        id_literal = validated_data.pop('id_literal')
        disenador = validated_data.pop('disenador', None)
        literal = literal_crear_actualizar(
            literal_id=instance.id,
            abierto=abierto,
            descripcion=descripcion,
            id_literal=id_literal,
            disenador_id=disenador.id if disenador is not None else None
        )
        return literal

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
            'correo_apertura',
            'disenador',
            'abierto',
            'en_cguno',
            'descripcion',
            'costo_materiales',
            'costo_mano_obra',
            'costo_mano_obra_inicial',
            'cantidad_horas_mano_obra',
            'cantidad_horas_mano_obra_inicial',
            'proyecto',
            'fecha_entrega_pactada',
            'mis_documentos',
            'materiales',
            'mis_horas_trabajadas',
            'mis_horas_trabajadas_iniciales',
            'facturas',
            'valor_cliente',
        ]
        extra_kwargs = {
            'materiales': {'read_only': True},
            'mis_horas_trabajadas': {'read_only': True},
            'mis_documentos': {'read_only': True},
            'mis_horas_trabajadas_iniciales': {'read_only': True},
            'facturas': {'read_only': True},
        }
        read_only_fields = ['correo_apertura']


class LiteralMaestraSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Literal
        fields = [
            'id',
            'id_literal',
            'abierto',
            'descripcion',
        ]
        read_only_fields = fields


class ProyectoMaestraSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return '%s - %s' % (instance.id_proyecto, instance.nombre)

    class Meta:
        model = Proyecto
        fields = [
            'id',
            'id_proyecto',
            'nombre',
            'to_string',
        ]
        read_only_fields = fields


class ProyectoSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    tipo_id_proyecto = serializers.CharField(max_length=2, allow_null=True, required=False)
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
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

    def update(self, instance, validated_data):
        from .services import proyecto_crear_actualizar
        id_proyecto = validated_data.get('id_proyecto', None)
        abierto = validated_data.get('abierto', None)
        nombre = validated_data.get('nombre', None)
        cotizacion_componentes_nro_cotizacion = validated_data.get('cotizacion_componentes_nro_cotizacion', None)
        cotizacion_componentes_nro_orden_compra = validated_data.get('cotizacion_componentes_nro_orden_compra', None)
        cotizacion_componentes_precio_venta = validated_data.get('cotizacion_componentes_precio_venta', 0)
        proyecto = proyecto_crear_actualizar(
            proyecto_id=instance.id,
            nombre=nombre,
            abierto=abierto,
            id_proyecto=id_proyecto,
            cotizacion_componentes_precio_venta=cotizacion_componentes_precio_venta,
            cotizacion_componentes_nro_cotizacion=cotizacion_componentes_nro_cotizacion,
            cotizacion_componentes_nro_orden_compra=cotizacion_componentes_nro_orden_compra
        )
        return proyecto

    def create(self, validated_data):
        from .services import proyecto_crear_actualizar
        proyecto_id = validated_data.get('proyecto_id', None)
        id_proyecto = validated_data.get('id_proyecto', None)
        tipo_id_proyecto = validated_data.get('tipo_id_proyecto', None)
        nombre = validated_data.get('nombre', None)
        cotizacion_relacionada_id = validated_data.get('cotizacion_relacionada_id', None)
        cotizacion_componentes_nro_cotizacion = validated_data.get('cotizacion_componentes_nro_cotizacion', None)
        cotizacion_componentes_nro_orden_compra = validated_data.get('cotizacion_componentes_nro_orden_compra', None)
        cotizacion_componentes_precio_venta = validated_data.get('cotizacion_componentes_precio_venta', 0)
        proyecto = proyecto_crear_actualizar(
            proyecto_id=proyecto_id,
            id_proyecto=id_proyecto,
            tipo_id_proyecto=tipo_id_proyecto,
            nombre=nombre,
            cotizacion_relacionada_id=cotizacion_relacionada_id,
            cotizacion_componentes_precio_venta=cotizacion_componentes_precio_venta,
            cotizacion_componentes_nro_orden_compra=cotizacion_componentes_nro_orden_compra,
            cotizacion_componentes_nro_cotizacion=cotizacion_componentes_nro_cotizacion
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
            'cliente',
            'cliente_nombre',
            'cotizacion_componentes_nro_cotizacion',
            'cotizacion_componentes_precio_venta',
            'cotizacion_componentes_nro_orden_compra',
            'tipo_id_proyecto',
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
            'id_proyecto': {'allow_null': True, 'required': False},
            'cotizacion_componentes_nro_cotizacion': {'allow_null': True, 'required': False},
            'cotizacion_componentes_precio_venta': {'allow_null': True, 'required': False},
            'cotizacion_componentes_nro_orden_compra': {'allow_null': True, 'required': False},
        }


class LiteralConDetalleSerializer(LiteralSerializer):
    mis_documentos = ArchivoLiteralSerializer(
        many=True,
        read_only=True
    )
    materiales = ItemsLiteralDetalleSerializer(many=True, read_only=True)
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
            'estado',
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
            'costo_presupuestado',
            'unidad_negocio',
            'descripcion_cotizacion',
            'cotizaciones_adicionales'
        ]


class ProyectoConDetalleSerializer(ProyectoSerializer):
    mis_literales = LiteralConDetalleSerializer(many=True, read_only=True)
    mis_documentos = ArchivoProyectoSerializer(many=True, read_only=True)
    cotizaciones = CotizacionProyectoSerializer(
        many=True,
        read_only=True
    )


# Consecutivo proyectos
class ConsecutivoProyectoCotizacionAdicionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'fecha_entrega_pactada',
            'dias_para_vencer',
            'unidad_negocio',
            'nro_cotizacion',
        ]


class ConsecutivoProyectoCotizacionSerializer(serializers.ModelSerializer):
    cotizaciones_adicionales = ConsecutivoProyectoCotizacionAdicionalSerializer(many=True, read_only=True)

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'fecha_entrega_pactada',
            'dias_para_vencer',
            'unidad_negocio',
            'nro_cotizacion',
            'cotizaciones_adicionales'
        ]
        read_only_fields = fields


class ConsecutivoProyectoLiteralSerializer(serializers.ModelSerializer):
    cotizaciones = ConsecutivoProyectoCotizacionSerializer(many=True, read_only=True)
    disenador_nombre = serializers.CharField(source='disenador.get_full_name', read_only=True)

    class Meta:
        model = Literal
        fields = [
            'id',
            'id_literal',
            'abierto',
            'proyecto',
            'en_cguno',
            'disenador',
            'disenador_nombre',
            'descripcion',
            'cotizaciones',
        ]
        read_only_fields = fields


class ConsecutivoProyectoSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    cotizaciones = ConsecutivoProyectoCotizacionSerializer(many=True, read_only=True)
    mis_literales = ConsecutivoProyectoLiteralSerializer(many=True, read_only=True)

    class Meta:
        model = Proyecto
        fields = [
            'id',
            'cliente',
            'cliente_nombre',
            'id_proyecto',
            'cotizacion_componentes_precio_venta',
            'cotizacion_componentes_nro_orden_compra',
            'cotizacion_componentes_nro_cotizacion',
            'nombre',
            'mis_literales',
            'cotizaciones'
        ]

        read_only_fields = fields


class ComparativaProyectoCotizacionSerializer(serializers.ModelSerializer):
    class Meta:
        model: Proyecto
        fields = [
            'id'
        ]
