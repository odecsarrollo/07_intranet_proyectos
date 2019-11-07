from django.utils import timezone
from rest_framework import serializers

from proyectos.models import Literal
from .models import (
    ProformaAnticipo,
    ProformaAnticipoItem,
    ProformaConfiguracion,
    ProformaAnticipoEnvios,
    ProformaAnticipoArchivo)


class ProformaConfiguracionSerializer(serializers.ModelSerializer):
    borrar_firma = serializers.BooleanField(default=False)
    borrar_encabezado = serializers.BooleanField(default=False)

    def update(self, instance, validated_data):
        borrar_firma = validated_data.get('borrar_firma')
        borrar_encabezado = validated_data.get('borrar_encabezado')
        if borrar_firma:
            validated_data['firma'] = None
            validated_data['borrar_firma'] = False
        if borrar_encabezado:
            validated_data['encabezado'] = None
            validated_data['borrar_encabezado'] = False
        return super().update(instance, validated_data)

    class Meta:
        model = ProformaConfiguracion
        fields = [
            'url',
            'id',
            'informacion_odecopack',
            'borrar_firma',
            'borrar_encabezado',
            'informacion_bancaria',
            'email_copia_default',
            'email_from_default',
            'firma',
            'encabezado',
        ]


class ProformaAnticipoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaAnticipoItem
        fields = [
            'url',
            'id',
            'proforma_anticipo',
            'descripcion',
            'referencia',
            'cantidad',
            'valor_unitario',
        ]


class ProformaAnticipoEnvioSerializer(serializers.ModelSerializer):
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
        model = ProformaAnticipoEnvios
        fields = [
            'id',
            'created',
            'proforma_anticipo',
            'creado_por',
            'creado_por_username',
            'archivo',
            'archivo_url',
            'size',
            'extension',
            'version',
        ]


class ProformaAnticipoSerializer(serializers.ModelSerializer):
    valor_total_con_impuesto = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    valor_total_sin_impuesto = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    color_estado = serializers.SerializerMethodField()
    porcentaje_a_verificacion = serializers.SerializerMethodField()
    fecha_seguimiento = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
        allow_null=True,
        required=False
    )
    fecha_cobro = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
        allow_null=True,
        required=False
    )

    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return 'Cobro con Id %s' % instance.id

    def get_porcentaje_a_verificacion(self, obj):
        fecha_ini = obj.fecha_cambio_estado
        fecha_seg = obj.fecha_seguimiento
        if obj.estado not in ['ENVIADA', 'RECIBIDA']:
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

    def get_color_estado(self, obj):
        fecha_ini = obj.fecha_cambio_estado
        fecha_seg = obj.fecha_seguimiento
        fecha_act = timezone.datetime.now().date()
        if obj.estado not in ['ENVIADA', 'RECIBIDA']:
            return 'white'
        else:
            if not fecha_seg:
                return 'tomato'
            elif fecha_ini and fecha_seg:
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

    def create(self, validated_data):
        from .services import proforma_anticipo_crear_actualizar
        informacion_locatario = validated_data.get('informacion_locatario', None)
        tipo_documento = validated_data.get('tipo_documento')
        informacion_cliente = validated_data.get('informacion_cliente')
        divisa = validated_data.get('divisa')
        nit = validated_data.get('nit')
        nombre_cliente = validated_data.get('nombre_cliente')
        fecha = validated_data.get('fecha')
        nro_orden_compra = validated_data.get('nro_orden_compra')
        condicion_pago = validated_data.get('condicion_pago')
        email_destinatario = validated_data.get('email_destinatario', None)
        email_destinatario_dos = validated_data.get('email_destinatario_dos', None)
        impuesto = validated_data.get('impuesto', 0)
        anticipo = proforma_anticipo_crear_actualizar(
            email_destinatario_dos=email_destinatario_dos,
            email_destinatario=email_destinatario,
            informacion_locatario=informacion_locatario,
            informacion_cliente=informacion_cliente,
            divisa=divisa,
            nit=nit,
            nombre_cliente=nombre_cliente,
            fecha=fecha,
            nro_orden_compra=nro_orden_compra,
            condicion_pago=condicion_pago,
            impuesto=impuesto,
            tipo_documento=tipo_documento
        )
        return anticipo

    def update(self, instance, validated_data):
        from .services import proforma_anticipo_crear_actualizar
        informacion_locatario = validated_data.get('informacion_locatario', None)
        informacion_cliente = validated_data.get('informacion_cliente')
        fecha_seguimiento = validated_data.get('fecha_seguimiento')
        email_destinatario = validated_data.get('email_destinatario', None)
        email_destinatario_dos = validated_data.get('email_destinatario_dos', None)
        impuesto = validated_data.get('impuesto', 0)
        tipo_documento = validated_data.get('tipo_documento')
        divisa = validated_data.get('divisa')
        observacion = validated_data.get('observacion')
        nit = validated_data.get('nit')
        nombre_cliente = validated_data.get('nombre_cliente')
        fecha = validated_data.get('fecha')
        fecha_cobro = validated_data.get('fecha_cobro')
        nro_orden_compra = validated_data.get('nro_orden_compra')
        condicion_pago = validated_data.get('condicion_pago')
        anticipo = proforma_anticipo_crear_actualizar(
            observacion=observacion,
            fecha_cobro=fecha_cobro,
            email_destinatario_dos=email_destinatario_dos,
            email_destinatario=email_destinatario,
            informacion_locatario=informacion_locatario,
            informacion_cliente=informacion_cliente,
            divisa=divisa,
            fecha_seguimiento=fecha_seguimiento,
            nit=nit,
            nombre_cliente=nombre_cliente,
            fecha=fecha,
            nro_orden_compra=nro_orden_compra,
            condicion_pago=condicion_pago,
            tipo_documento=tipo_documento,
            impuesto=impuesto,
            id=instance.id
        )
        return anticipo

    class Meta:
        model = ProformaAnticipo
        fields = [
            'url',
            'id',
            'cliente',
            'nro_consecutivo',
            'informacion_locatario',
            'informacion_cliente',
            'tipo_documento',
            'divisa',
            'nit',
            'editable',
            'envios',
            'to_string',
            'documentos',
            'fecha_cobro',
            'items',
            'observacion',
            'nombre_cliente',
            'observacion',
            'estado_display',
            'fecha_seguimiento',
            'estado',
            'literales',
            'email_destinatario',
            'email_destinatario_dos',
            'cobrado',
            'fecha',
            'nro_orden_compra',
            'editable',
            'condicion_pago',
            'impuesto',
            'estado',
            'porcentaje_a_verificacion',
            'color_estado',
            'valor_total_sin_impuesto',
            'version',
            'valor_total_con_impuesto',
        ]
        extra_kwargs = {
            'nro_consecutivo': {'read_only': True},
            'informacion_locatario': {'allow_blank': True},
            'email_destinatario': {'allow_blank': True},
            'email_destinatario_dos': {'allow_blank': True},
            'observacion': {'allow_blank': True},
            'editable': {'read_only': True},
            'items': {'read_only': True},
            'version': {'read_only': True},
            'documentos': {'read_only': True},
            'envios': {'read_only': True},
            'literales': {'read_only': True},
        }


class ProformaAnticipoLiteralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Literal
        fields = [
            'id',
            'id_literal',
            'descripcion',
        ]


class ProformaAnticipoArchivoSerializer(serializers.ModelSerializer):
    archivo_url = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    def get_size(self, obj):
        if obj.archivo:
            return obj.archivo.size if obj.archivo.size else None
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
        model = ProformaAnticipoArchivo
        fields = [
            'id',
            'enviar_por_correo',
            'nombre_archivo',
            'archivo_url',
            'creado_por',
            'extension',
            'archivo',
            'cobro',
            'size',
        ]


class ProformaAnticipoConDetalleSerializer(ProformaAnticipoSerializer):
    items = ProformaAnticipoItemSerializer(many=True, read_only=True)
    documentos = ProformaAnticipoArchivoSerializer(read_only=True, many=True)
    envios = ProformaAnticipoEnvioSerializer(read_only=True, many=True)
    literales = ProformaAnticipoLiteralSerializer(many=True, read_only=True)
