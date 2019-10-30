from django.utils import timezone

from rest_framework import serializers

from proyectos.models import Proyecto, Literal
from .models import Cotizacion, SeguimientoCotizacion, ArchivoCotizacion


# region Serializadores Cotizacion
class CotizacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente_cotizacion.nombre', read_only=True)
    cliente_id = serializers.CharField(source='cliente_cotizacion.id', read_only=True)
    cotizacion_inicial_nro = serializers.CharField(source='cotizacion_inicial.nro_cotizacion', read_only=True)
    cotizacion_inicial_unidad_negocio = serializers.CharField(
        source='cotizacion_inicial.unidad_negocio',
        read_only=True
    )
    contacto_cliente_nombre = serializers.CharField(source='contacto_cotizacion.full_nombre', read_only=True)
    valor_orden_compra_mes = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    valor_orden_compra_adicionales = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    valor_total_orden_compra_cotizaciones = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    costo_presupuestado_adicionales = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    responsable_actual = serializers.CharField(source='responsable.username', read_only=True)
    responsable_actual_nombre = serializers.CharField(source='responsable.get_full_name', read_only=True)
    orden_compra_fecha = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
        allow_null=True,
        required=False
    )
    fecha_entrega_pactada = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
        allow_null=True,
        required=False
    )
    fecha_entrega_pactada_cotizacion = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
        allow_null=True,
        required=False
    )
    fecha_limite_segumiento_estado = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
        allow_null=True,
        required=False
    )
    color_tuberia_ventas = serializers.SerializerMethodField()
    porcentaje_tuberia_ventas = serializers.SerializerMethodField()

    to_string = serializers.SerializerMethodField()
    creado = serializers.DateTimeField(
        source='created',
        format="%Y-%m-%d",
        read_only=True
    )
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    def create(self, validated_data):
        from .services import cotizacion_crear
        created_by = validated_data.get('created_by', None)
        unidad_negocio = validated_data.get('unidad_negocio', None)
        descripcion_cotizacion = validated_data.get('descripcion_cotizacion', None)
        origen_cotizacion = validated_data.get('origen_cotizacion', None)
        observacion = validated_data.get('observacion', None)
        cliente = validated_data.get('cliente', None)
        contacto_cliente = validated_data.get('contacto_cliente', None)
        cotizacion_inicial = validated_data.get('cotizacion_inicial', None)
        fecha_entrega_pactada_cotizacion = validated_data.get('fecha_entrega_pactada_cotizacion', None)
        fecha_limite_segumiento_estado = validated_data.get('fecha_limite_segumiento_estado', None)
        cotizacion = cotizacion_crear(
            created_by_id=created_by.id,
            unidad_negocio=unidad_negocio,
            descripcion_cotizacion=descripcion_cotizacion,
            observacion=observacion,
            origen_cotizacion=origen_cotizacion,
            cliente_id=None if cliente is None else cliente.id,
            contacto_cliente_id=None if contacto_cliente is None else contacto_cliente.id,
            fecha_entrega_pactada_cotizacion=fecha_entrega_pactada_cotizacion,
            fecha_limite_segumiento_estado=fecha_limite_segumiento_estado,
            cotizacion_inicial_id=None if cotizacion_inicial is None else cotizacion_inicial.id
        )
        return cotizacion

    def update(self, cotizacion, validated_data):
        from .services import cotizacion_actualizar
        created_by = validated_data.get('created_by', None)
        estado = validated_data.get('estado', None)
        responsable = validated_data.get('responsable', None)
        unidad_negocio = validated_data.get('unidad_negocio', None)
        descripcion_cotizacion = validated_data.get('descripcion_cotizacion', None)
        origen_cotizacion = validated_data.get('origen_cotizacion', None)
        fecha_entrega_pactada_cotizacion = validated_data.get('fecha_entrega_pactada_cotizacion', None)
        fecha_limite_segumiento_estado = validated_data.get('fecha_limite_segumiento_estado', None)
        cotizacion_inicial = validated_data.get('cotizacion_inicial', None)
        observacion = validated_data.get('observacion', None)
        cliente = validated_data.get('cliente', None)
        contacto_cliente = validated_data.get('contacto_cliente', None)
        costo_presupuestado = validated_data.get('costo_presupuestado', 0)
        orden_compra_nro = validated_data.get('orden_compra_nro', None)
        fecha_entrega_pactada = validated_data.get('fecha_entrega_pactada', None)
        orden_compra_fecha = validated_data.get('orden_compra_fecha', None)
        valor_ofertado = validated_data.get('valor_ofertado', 0)
        valor_orden_compra = validated_data.get('valor_orden_compra', 0)
        estado_observacion_adicional = validated_data.get('estado_observacion_adicional', None)
        cotizacion = cotizacion_actualizar(
            cotizacion_id=cotizacion.id,
            modified_by_id=created_by.id,
            estado=estado,
            unidad_negocio=unidad_negocio,
            responsable_id=responsable.id,
            descripcion_cotizacion=descripcion_cotizacion,
            origen_cotizacion=origen_cotizacion,
            fecha_entrega_pactada_cotizacion=fecha_entrega_pactada_cotizacion,
            fecha_limite_segumiento_estado=fecha_limite_segumiento_estado,
            cotizacion_inicial_id=None if cotizacion_inicial is None else cotizacion_inicial.id,
            observacion=observacion,
            cliente_id=None if cliente is None else cliente.id,
            contacto_cliente_id=None if contacto_cliente is None else contacto_cliente.id,
            valor_ofertado=valor_ofertado,
            costo_presupuestado=costo_presupuestado,
            orden_compra_nro=orden_compra_nro,
            fecha_entrega_pactada=fecha_entrega_pactada,
            orden_compra_fecha=orden_compra_fecha,
            valor_orden_compra=valor_orden_compra,
            estado_observacion_adicional=estado_observacion_adicional,
        )
        return cotizacion

    def get_to_string(self, instance):
        nro_cotizacion = ''
        if instance.nro_cotizacion:
            nro_cotizacion = '%s -' % (instance.nro_cotizacion)
        return '%s%s' % (nro_cotizacion, instance.descripcion_cotizacion.title())

    def get_porcentaje_tuberia_ventas(self, obj):
        fecha_ini = obj.fecha_cambio_estado
        fecha_seg = obj.fecha_limite_segumiento_estado
        if obj.estado in ['Cierre (Aprobado)', 'Cancelado', 'Aplazado']:
            return None
        if fecha_ini and fecha_seg:
            fecha_act = timezone.datetime.now().date()
            delta = (fecha_act - fecha_ini).days
            dias = (fecha_seg - fecha_ini).days
            if dias == 0:
                porcentaje = 1
            else:
                porcentaje = delta / dias
            return round(porcentaje * 100, 2)
        else:
            return None

    def get_color_tuberia_ventas(self, obj):
        fecha_ini = obj.fecha_cambio_estado
        fecha_seg = obj.fecha_limite_segumiento_estado
        fecha_act = timezone.datetime.now().date()
        if obj.estado in ['Cierre (Aprobado)', 'Cancelado', 'Aplazado']:
            return None
        if fecha_ini and fecha_seg:
            delta = (fecha_act - fecha_ini).days
            dias = (fecha_seg - fecha_ini).days
            if dias == 0:
                porcentaje = 1
            else:
                porcentaje = delta / dias
            if porcentaje >= 0.9:
                return 'tomato'
            elif porcentaje > 0.66:
                return 'yellow'
            else:
                return 'lightgreen'
        if not obj.fecha_cambio_estado:
            return None

    class Meta:
        model = Cotizacion
        fields = [
            'url',
            'id',
            'created_by',
            'creado',
            'cotizacion_inicial',
            'cotizacion_inicial_nro',
            'cotizacion_inicial_unidad_negocio',
            'responsable',
            'revisar',
            'origen_cotizacion',
            'responsable_actual',
            'responsable_actual_nombre',
            'nro_cotizacion',
            'unidad_negocio',
            'descripcion_cotizacion',
            'cliente',
            'cliente_nombre',
            'cliente_id',
            'relacionada',
            'contacto_cliente',
            'contacto_cliente_nombre',
            'contacto',
            'estado',
            'estado_observacion_adicional',
            'observacion',
            'valor_ofertado',
            'valor_orden_compra',
            'valor_orden_compra_mes',
            'valor_orden_compra_adicionales',
            'costo_presupuestado',
            'costo_presupuestado_adicionales',
            'valor_total_orden_compra_cotizaciones',
            'orden_compra_nro',
            'proyectos',
            'cotizaciones_adicionales',
            'abrir_carpeta',
            'orden_compra_fecha',
            'fecha_cambio_estado',
            'fecha_entrega_pactada',
            'fecha_entrega_pactada_cotizacion',
            'fecha_limite_segumiento_estado',
            'color_tuberia_ventas',
            'porcentaje_tuberia_ventas',
            'to_string',
            'es_adicional',
            'literales',
        ]
        extra_kwargs = {
            'literales': {'read_only': True},
            'es_adicional': {'read_only': True},
            'cliente_id': {'read_only': True},
            'cotizacion_inicial': {'allow_null': True},
            'revisar': {'read_only': True},
            'abrir_carpeta': {'read_only': True},
            'relacionada': {'read_only': True},
            'cotizaciones_adicionales': {'read_only': True},
            'proyectos': {'read_only': True},
            'responsable_actual': {'read_only': True},
            'fecha_cambio_estado': {'read_only': True},
            'contacto': {'allow_null': True},
            'origen_cotizacion': {'allow_null': True},
            'estado_observacion_adicional': {'allow_null': True},
            'fecha_limite_segumiento_estado': {'allow_null': True},
        }


class CotizacionTuberiaVentaSerializer(serializers.ModelSerializer):
    color_tuberia_ventas = serializers.SerializerMethodField()
    porcentaje_tuberia_ventas = serializers.SerializerMethodField()
    cliente_nombre = serializers.CharField(source='cliente_cotizacion.nombre', read_only=True)
    contacto_cliente_nombre = serializers.CharField(source='contacto_cotizacion.full_nombre', read_only=True)
    responsable_actual_nombre = serializers.CharField(source='responsable.get_full_name', read_only=True)

    def get_color_tuberia_ventas(self, obj):
        fecha_ini = obj.fecha_cambio_estado
        fecha_seg = obj.fecha_limite_segumiento_estado
        fecha_act = timezone.datetime.now().date()
        if obj.estado in ['Cierre (Aprobado)', 'Cancelado', 'Aplazado']:
            return None
        if fecha_ini and fecha_seg:
            delta = (fecha_act - fecha_ini).days
            dias = (fecha_seg - fecha_ini).days
            if dias == 0:
                porcentaje = 1
            else:
                porcentaje = delta / dias
            if porcentaje >= 0.9:
                return 'tomato'
            elif porcentaje > 0.66:
                return 'yellow'
            else:
                return 'lightgreen'
        if not obj.fecha_cambio_estado:
            return None

    def get_porcentaje_tuberia_ventas(self, obj):
        fecha_ini = obj.fecha_cambio_estado
        fecha_seg = obj.fecha_limite_segumiento_estado
        if obj.estado in ['Cierre (Aprobado)', 'Cancelado', 'Aplazado']:
            return None
        if fecha_ini and fecha_seg:
            fecha_act = timezone.datetime.now().date()
            delta = (fecha_act - fecha_ini).days
            dias = (fecha_seg - fecha_ini).days
            if dias == 0:
                porcentaje = 1
            else:
                porcentaje = delta / dias
            return round(porcentaje * 100, 2)
        else:
            return None

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'color_tuberia_ventas',
            'nro_cotizacion',
            'unidad_negocio',
            'cliente_nombre',
            'contacto_cliente_nombre',
            'responsable_actual_nombre',
            'descripcion_cotizacion',
            'fecha_limite_segumiento_estado',
            'estado',
            'valor_ofertado',
            'porcentaje_tuberia_ventas',
        ]
        read_only_fields = fields


class CotizacionParaAbrirCarpetaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente_cotizacion.nombre', read_only=True)
    cotizacion_inicial_nro = serializers.CharField(source='cotizacion_inicial.nro_cotizacion', read_only=True)
    cotizacion_inicial_unidad_negocio = serializers.CharField(
        source='cotizacion_inicial.unidad_negocio',
        read_only=True
    )

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'nro_cotizacion',
            'unidad_negocio',
            'cotizacion_inicial_nro',
            'cotizacion_inicial_unidad_negocio',
            'revisar',
            'descripcion_cotizacion',
            'cliente_nombre',
            'abrir_carpeta',
        ]
        read_only_fields = fields


class ProyectoCotizacionConDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = [
            'id',
            'id_proyecto'
        ]
        read_only_fields = fields


class CotizacionCotizacionConDetalleSerializer(serializers.ModelSerializer):
    contacto_cliente_nombre = serializers.CharField(source='contacto_cotizacion.full_nombre', read_only=True)

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'orden_compra_nro',
            'nro_cotizacion',
            'estado',
            'unidad_negocio',
            'cotizaciones_adicionales',
            'contacto_cliente_nombre',
        ]
        read_only_fields = fields


class LiteralCotizacionConDetalle(serializers.ModelSerializer):
    class Meta:
        model = Literal
        fields = [
            'id',
            'id_literal',
            'descripcion',
            'proyecto_id',
        ]
        read_only_fields = fields


class CotizacionConDetalleSerializer(CotizacionSerializer):
    literales = LiteralCotizacionConDetalle(many=True, read_only=True)
    proyectos = ProyectoCotizacionConDetalleSerializer(many=True, read_only=True)
    cotizaciones_adicionales = CotizacionCotizacionConDetalleSerializer(many=True, read_only=True)
    cotizacion_inicial = CotizacionCotizacionConDetalleSerializer(read_only=True)


# endregion

class SeguimientoCotizacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cotizacion.cliente.nombre', read_only=True)
    cliente = serializers.CharField(source='cotizacion.cliente.id', read_only=True)
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    fecha_inicio_tarea = serializers.DateTimeField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%d', 'iso-8601'],
        allow_null=True,
        required=False
    )
    fecha_fin_tarea = serializers.DateTimeField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%d', 'iso-8601'],
        allow_null=True,
        required=False
    )

    class Meta:
        model = SeguimientoCotizacion
        fields = [
            'url',
            'id',
            'cotizacion',
            'tipo_seguimiento',
            'observacion',
            'estado',
            'nombre_tarea',
            'fecha_inicio_tarea',
            'fecha_fin_tarea',
            'tarea_terminada',
            'created',
            'modified',
            'creado_por_username',
            'creado_por',
            'cliente',
            'cliente_nombre',
        ]
        extra_kwargs = {
            'created': {'read_only': True},
            'modified': {'read_only': True},
            'creado_por': {'read_only': True},
        }


class ArchivoCotizacionSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)

    def get_archivo_url(self, obj):
        if obj.archivo:
            return obj.archivo.url
        return None

    def get_extension(self, obj):
        extension = obj.archivo.url.split('.')[-1]
        if obj.archivo:
            return extension.title()
        return None

    def get_size(self, obj):
        if obj.archivo:
            return obj.archivo.size
        return None

    class Meta:
        model = ArchivoCotizacion
        fields = [
            'url',
            'id',
            'cotizacion',
            'extension',
            'created',
            'nombre_archivo',
            'creado_por_username',
            'archivo',
            'size',
            'archivo_url',
            'creado_por',
        ]
        extra_kwargs = {
            'created': {'read_only': True},
            'creado_por': {'read_only': True},
            'nombre_archivo': {'required': False},
        }
