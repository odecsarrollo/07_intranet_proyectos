from django.utils import timezone
from rest_framework import serializers

from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from proyectos.models import Literal
from proyectos.models import Proyecto
from .models import ArchivoCotizacion
from .models import CondicionInicioProyecto
from .models import CondicionInicioProyectoCotizacion
from .models import Cotizacion
from .models import CotizacionPagoProyectado
from .models import CotizacionPagoProyectadoAcuerdoPago
from .models import CotizacionPagoProyectadoAcuerdoPagoPago
from .models import SeguimientoCotizacion


class CondicionInicioProyectoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def create(self, validated_data):
        from .services import condicion_inicio_proyecto_crear_actualizar
        descripcion = validated_data.get('descripcion', None)
        condicion_especial = validated_data.get('condicion_especial', False)
        require_documento = validated_data.get('require_documento', False)
        condicion_inicio_proyecto = condicion_inicio_proyecto_crear_actualizar(
            descripcion=descripcion,
            condicion_especial=condicion_especial,
            require_documento=require_documento
        )
        return condicion_inicio_proyecto

    def update(self, instance, validated_data):
        from .services import condicion_inicio_proyecto_crear_actualizar
        descripcion = validated_data.get('descripcion', None)
        condicion_especial = validated_data.get('condicion_especial', False)
        require_documento = validated_data.get('require_documento', False)
        condicion_inicio_proyecto = condicion_inicio_proyecto_crear_actualizar(
            condicion_inicio_proyecto_id=instance.id,
            descripcion=descripcion,
            condicion_especial=condicion_especial,
            require_documento=require_documento
        )
        return condicion_inicio_proyecto

    def get_to_string(self, obj):
        return obj.descripcion

    class Meta:
        model = CondicionInicioProyecto
        fields = [
            'url',
            'id',
            'descripcion',
            'condicion_especial',
            'require_documento',
            'to_string',
        ]


class CondicionInicioProyectoCotizacionSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField()
    to_string = serializers.SerializerMethodField()
    documento_url = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()

    def update(self, instance, validated_data):
        fecha_entrega = validated_data.get('fecha_entrega', None)
        documento = validated_data.get('documento', None)
        from .services import condicion_inicio_proyecto_cotizacion_actualizar
        condicion = condicion_inicio_proyecto_cotizacion_actualizar(
            condicion_inicio_cotizacion_id=instance.id,
            fecha_entrega=fecha_entrega,
            documento=documento
        )
        return condicion

    def get_size(self, obj):
        if obj.documento:
            return obj.documento.size
        return None

    def get_documento_url(self, obj):
        if obj.documento:
            return obj.documento.url
        return None

    def get_extension(self, obj):
        if obj.documento:
            extension = obj.documento.url.split('.')[-1]
            return extension.title()
        return None

    def get_filename(self, obj):
        if obj.documento:
            return obj.documento.name.split('/')[-1]
        return None

    def get_to_string(self, obj):
        return obj.descripcion

    class Meta:
        model = CondicionInicioProyectoCotizacion
        fields = [
            'id',
            'cotizacion_proyecto',
            'descripcion',
            'documento_url',
            'size',
            'filename',
            'extension',
            'condicion_inicio_proyecto',
            'condicion_especial',
            'require_documento',
            'fecha_entrega',
            'documento',
            'to_string',
        ]
        read_only_fields = ['require_documento', 'condicion_inicio_proyecto']


# region Serializadores Cotizacion
class CotizacionSerializer(serializers.ModelSerializer):
    valores_oc = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    pagos = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    costo_presupuestado_adicionales = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    valores_oc_adicionales = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    pagos_adicionales = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    cliente_id = serializers.CharField(source='cliente.id', read_only=True)
    cotizacion_inicial_nro = serializers.CharField(source='cotizacion_inicial.nro_cotizacion', read_only=True)
    cotizacion_inicial_unidad_negocio = serializers.CharField(
        source='cotizacion_inicial.unidad_negocio',
        read_only=True
    )
    contacto_cliente_nombre = serializers.CharField(source='contacto_cliente.full_nombre', read_only=True)
    valor_orden_compra_mes = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    valor_total_orden_compra_cotizaciones = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    responsable_actual = serializers.CharField(source='responsable.username', read_only=True)
    responsable_actual_nombre = serializers.CharField(source='responsable.get_full_name', read_only=True)
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
        cotizacion = cotizacion_crear(
            created_by_id=created_by.id,
            unidad_negocio=unidad_negocio,
            descripcion_cotizacion=descripcion_cotizacion,
            observacion=observacion,
            origen_cotizacion=origen_cotizacion,
            cliente_id=None if cliente is None else cliente.id,
            contacto_cliente_id=None if contacto_cliente is None else contacto_cliente.id,
            fecha_entrega_pactada_cotizacion=fecha_entrega_pactada_cotizacion,
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
        observacion = validated_data.get('observacion', None)
        cliente = validated_data.get('cliente', None)
        contacto_cliente = validated_data.get('contacto_cliente', None)
        costo_presupuestado = validated_data.get('costo_presupuestado', 0)
        valor_ofertado = validated_data.get('valor_ofertado', 0)
        estado_observacion_adicional = validated_data.get('estado_observacion_adicional', None)
        dias_pactados_entrega_proyecto = validated_data.get('dias_pactados_entrega_proyecto', None)
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
            observacion=observacion,
            cliente_id=None if cliente is None else cliente.id,
            contacto_cliente_id=None if contacto_cliente is None else contacto_cliente.id,
            valor_ofertado=valor_ofertado,
            costo_presupuestado=costo_presupuestado,
            estado_observacion_adicional=estado_observacion_adicional,
            dias_pactados_entrega_proyecto=dias_pactados_entrega_proyecto
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
            'valores_oc_adicionales',
            'pagos_adicionales',
            'valores_oc',
            'pagos',
            'cotizacion_inicial',
            'cotizacion_inicial_nro',
            'cotizacion_inicial_unidad_negocio',
            'mis_seguimientos',
            'mis_documentos',
            'responsable',
            'origen_cotizacion',
            'condiciones_inicio_cotizacion',
            'dias_pactados_entrega_proyecto',
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
            'condiciones_inicio_completas',
            'estado',
            'estado_observacion_adicional',
            'observacion',
            'valor_ofertado',
            'valor_orden_compra_mes',
            'costo_presupuestado',
            'costo_presupuestado_adicionales',
            'valor_total_orden_compra_cotizaciones',
            'proyectos',
            'cotizaciones_adicionales',
            'abrir_carpeta',
            'fecha_cambio_estado',
            'fecha_entrega_pactada',
            'fecha_entrega_pactada_cotizacion',
            'fecha_limite_segumiento_estado',
            'color_tuberia_ventas',
            'porcentaje_tuberia_ventas',
            'condiciones_inicio_fecha_ultima',
            'to_string',
            'es_adicional',
            'literales',
            'dias_para_vencer',
            'pagos_proyectados',
        ]
        extra_kwargs = {
            'literales': {'read_only': True},
            'condiciones_inicio_cotizacion': {'read_only': True},
            'mis_seguimientos': {'read_only': True},
            'es_adicional': {'read_only': True},
            'relacionada': {'read_only': True},
            'cliente_id': {'read_only': True},
            'abrir_carpeta': {'read_only': True},
            'proyectos': {'read_only': True},
            'responsable_actual': {'read_only': True},
            'fecha_cambio_estado': {'read_only': True},
            'cotizaciones_adicionales': {'read_only': True},
            'mis_documentos': {'read_only': True},
            'cotizacion_inicial': {'allow_null': True},
            'observacion': {'allow_null': True},
            'estado_observacion_adicional': {'allow_null': True},
            'fecha_limite_segumiento_estado': {'allow_null': True},
            'dias_pactados_entrega_proyecto': {'allow_null': True},
        }
        read_only_fields = [
            'condiciones_inicio_completas',
            'condiciones_inicio_fecha_ultima',
            'fecha_entrega_pactada',
            'dias_para_vencer',
            'pagos_proyectados',
        ]


class CotizacionTuberiaVentaSerializer(serializers.ModelSerializer):
    valor_orden_compra_mes = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    valor_orden_compra_trimestre = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    color_tuberia_ventas = serializers.SerializerMethodField()
    porcentaje_tuberia_ventas = serializers.SerializerMethodField()
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    contacto_cliente_nombre = serializers.CharField(source='contacto_cliente.full_nombre', read_only=True)
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
            'valor_orden_compra_mes',
            'valor_orden_compra_trimestre',
            'unidad_negocio',
            'cliente_nombre',
            'cliente',
            'contacto_cliente',
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
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
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
            'cotizacion_inicial',
            'cotizacion_inicial_unidad_negocio',
            'revisada',
            'descripcion_cotizacion',
            'cliente_nombre',
            'abrir_carpeta',
            'notificar',
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


class CotizacionCotizacionConDetalleSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    contacto_cliente_nombre = serializers.CharField(source='contacto_cliente.full_nombre', read_only=True)

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'estado',
            'cliente',
            'nro_cotizacion',
            'contacto_cliente',
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


class CotizacionListSerializer(serializers.ModelSerializer):
    fecha_oc = serializers.DateField(
        format="%Y-%m-%d",
        read_only=True
    )
    valores_oc = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True, default=0)
    color_tuberia_ventas = serializers.SerializerMethodField()
    porcentaje_tuberia_ventas = serializers.SerializerMethodField()

    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    cliente_nit = serializers.CharField(source='cliente.nit', read_only=True)
    contacto_cliente_nombre = serializers.CharField(source='contacto_cliente.full_nombre', read_only=True)
    responsable_actual = serializers.CharField(source='responsable.username', read_only=True)
    responsable_actual_nombre = serializers.CharField(source='responsable.get_full_name', read_only=True)

    proyectos = ProyectoCotizacionConDetalleSerializer(many=True, read_only=True)

    cotizaciones_adicionales = CotizacionCotizacionConDetalleSerializer(
        many=True,
        read_only=True,
        context={
            'quitar_campos': [
                'estado',
                'cliente',
                'contacto_cliente',
                'cotizaciones_adicionales',
                'contacto_cliente_nombre',
            ]
        }
    )
    cotizacion_inicial = CotizacionCotizacionConDetalleSerializer(
        read_only=True,
        context={
            'quitar_campos': [
                'estado',
                'cliente',
                'contacto_cliente',
                'cotizaciones_adicionales',
                'contacto_cliente_nombre',
            ]
        }
    )

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
            'nro_cotizacion',
            'proyectos',
            'cotizaciones_adicionales',
            'cotizacion_inicial',
            'descripcion_cotizacion',
            'fecha_entrega_pactada_cotizacion',
            'estado',
            'cliente_nombre',
            'cliente_nit',
            'cliente',
            'contacto_cliente',
            'contacto_cliente_nombre',
            'responsable_actual',
            'responsable_actual_nombre',
            'porcentaje_tuberia_ventas',
            'color_tuberia_ventas',
            'unidad_negocio',
            'fecha_limite_segumiento_estado',
            'valor_ofertado',
            'valores_oc',
            'fecha_oc',
        ]
        read_only_fields = fields


# endregion

class SeguimientoCotizacionSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cotizacion.cliente.nombre', read_only=True)
    cliente = serializers.CharField(source='cotizacion.cliente.id', read_only=True)
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    fecha_inicio_tarea = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
        allow_null=True,
        required=False
    )
    fecha_fin_tarea = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
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
            try:
                return obj.archivo.url
            except FileNotFoundError:
                return None
        return None

    def get_extension(self, obj):
        if obj.archivo:
            try:
                extension = obj.archivo.url.split('.')[-1]
                return extension.title()
            except FileNotFoundError:
                return None
        return None

    def get_size(self, obj):
        if obj.archivo:
            try:
                return obj.archivo.size
            except FileNotFoundError:
                return None
        return None

    class Meta:
        model = ArchivoCotizacion
        fields = [
            'url',
            'id',
            'cotizacion',
            'extension',
            'tipo',
            'created',
            'nombre_archivo',
            'creado_por_username',
            'get_tipo_display',
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


class CotizacionPagoProyectadoAcuerdoPagoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CotizacionPagoProyectadoAcuerdoPagoPago
        fields = [
            'id',
            'fecha',
            'acuerdo_pago',
            'comprobante_pago',
            'valor'
        ]
        read_only_fields = fields


class CotizacionProyectosInformeGerenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = [
            'id',
            'id_proyecto',
            'nombre',
        ]

        read_only_fields = fields


class CotizacionPagoProyectadoAcuerdoPagoInformeGerenciaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='orden_compra.cotizacion.cliente.nombre', read_only=True)
    cliente_nit = serializers.CharField(source='orden_compra.cotizacion.cliente.nit', read_only=True)
    responsable = serializers.CharField(source='orden_compra.cotizacion.responsable.get_full_name', read_only=True)
    orden_compra_fecha = serializers.CharField(source='orden_compra.orden_compra_fecha', read_only=True)
    orden_compra_nro = serializers.CharField(source='orden_compra.orden_compra_nro', read_only=True)
    recaudo = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    proyectos = CotizacionProyectosInformeGerenciaSerializer(
        source='orden_compra.cotizacion.proyectos',
        many=True,
        read_only=True
    )

    class Meta:
        model = CotizacionPagoProyectadoAcuerdoPago
        fields = [
            'id',
            'motivo',
            'cliente_nombre',
            'proyectos',
            'orden_compra_fecha',
            'orden_compra_nro',
            'proyectos',
            'cliente_nit',
            'responsable',
            'recaudo',
            'fecha_proyectada',
            'valor_proyectado',
            'porcentaje',
            'requisitos'
        ]
        read_only_fields = fields


class CotizacionPagoProyectadoAcuerdoPagoSerializer(serializers.ModelSerializer):
    pagos = CotizacionPagoProyectadoAcuerdoPagoPagoSerializer(many=True, read_only=True)

    class Meta:
        model = CotizacionPagoProyectadoAcuerdoPago
        fields = [
            'id',
            'motivo',
            'fecha_proyectada',
            'valor_proyectado',
            'porcentaje',
            'pagos',
            'requisitos'
        ]
        read_only_fields = fields


class CotizacionPagoProyectadoInformeGerencialSerializer(serializers.ModelSerializer):
    cotizacion_estado = serializers.CharField(source='cotizacion.estado', read_only=True)
    cotizacion_cliente_nombre = serializers.CharField(source='cotizacion.cliente.nombre', read_only=True)
    cotizacion_cliente_nit = serializers.CharField(source='cotizacion.cliente.nit', read_only=True)
    cotizacion_responsable = serializers.CharField(source='cotizacion.responsable.get_full_name', read_only=True)

    class Meta:
        model = CotizacionPagoProyectado
        fields = [
            'id',
            'valor_orden_compra',
            'orden_compra_fecha',
            'orden_compra_nro',
            'cotizacion_estado',
            'cotizacion_cliente_nit',
            'cotizacion_cliente_nombre',
            'cotizacion_responsable',
        ]
        read_only_fields = fields


class CotizacionPagoProyectadoSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    orden_compra_archivo_filename = serializers.SerializerMethodField()
    orden_compra_archivo_size = serializers.SerializerMethodField()
    orden_compra_archivo_extension = serializers.SerializerMethodField()
    orden_compra_archivo = serializers.SerializerMethodField()

    def get_orden_compra_archivo(self, obj):
        if hasattr(obj, 'orden_compra_documento') and obj.orden_compra_documento.archivo:
            try:
                return obj.orden_compra_documento.archivo.url
            except FileNotFoundError:
                return None
        return None

    def get_orden_compra_archivo_extension(self, obj):
        if hasattr(obj, 'orden_compra_documento') and obj.orden_compra_documento.archivo:
            try:
                extension = obj.orden_compra_documento.archivo.url.split('.')[-1]
                return extension.title()
            except FileNotFoundError:
                return None
        return None

    def get_orden_compra_archivo_size(self, obj):
        if hasattr(obj, 'orden_compra_documento') and obj.orden_compra_documento.archivo:
            try:
                return obj.orden_compra_documento.archivo.size
            except FileNotFoundError:
                return None
        return None

    def get_orden_compra_archivo_filename(self, obj):
        if hasattr(obj, 'orden_compra_documento') and obj.orden_compra_documento.archivo:
            try:
                return obj.orden_compra_documento.archivo.name.split('/')[-1]
            except FileNotFoundError:
                return None
        return None

    class Meta:
        model = CotizacionPagoProyectado
        fields = [
            'id',
            'valor_orden_compra',
            'orden_compra_nro',
            'orden_compra_fecha',
            'orden_compra_archivo_filename',
            'orden_compra_archivo_size',
            'orden_compra_archivo_extension',
            'orden_compra_archivo',
            'acuerdos_pagos'
        ]
        read_only_fields = fields


class CotizacionPagoProyectadoConDetalleSerializer(CotizacionPagoProyectadoSerializer):
    acuerdos_pagos = CotizacionPagoProyectadoAcuerdoPagoSerializer(many=True, read_only=True, default=0)


class CotizacionConDetalleSerializer(CotizacionSerializer):
    literales = LiteralCotizacionConDetalle(many=True, read_only=True)
    proyectos = ProyectoCotizacionConDetalleSerializer(many=True, read_only=True)
    cotizaciones_adicionales = CotizacionCotizacionConDetalleSerializer(many=True, read_only=True)
    cotizacion_inicial = CotizacionCotizacionConDetalleSerializer(read_only=True)
    condiciones_inicio_cotizacion = CondicionInicioProyectoCotizacionSerializer(many=True, read_only=True)
    mis_seguimientos = SeguimientoCotizacionSerializer(
        many=True,
        read_only=True,
        context={'quitar_campos': ['cliente_nombre', 'cliente']}
    )
    mis_documentos = ArchivoCotizacionSerializer(many=True, read_only=True)
    pagos_proyectados = CotizacionPagoProyectadoConDetalleSerializer(many=True, read_only=True)


class CotizacionInformeGerenciaSerializer(serializers.ModelSerializer):
    '''Para el reporete de gerencia'''
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    cliente_nit = serializers.CharField(source='cliente.nit', read_only=True)
    responsable_actual_nombre = serializers.CharField(source='responsable.get_full_name', read_only=True)

    class Meta:
        model = Cotizacion
        fields = [
            'id',
            'unidad_negocio',
            'estado',
            'valor_ofertado',
            'cliente_nombre',
            'cliente_nit',
            'responsable_actual_nombre',
        ]
        read_only_fields = fields
