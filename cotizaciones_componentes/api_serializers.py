from rest_framework import serializers

from envios_emails.api_serializers import CotizacionComponenteEnvioSerializer
from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from .models import (
    CotizacionComponente,
    ItemCotizacionComponente,
    CotizacionComponenteAdjunto,
    CotizacionComponenteSeguimiento
)


class CotizacionComponenteAdjuntoSerializer(serializers.ModelSerializer):
    adjunto_url = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    imagen_thumbnail = serializers.ImageField(read_only=True)

    def get_adjunto_url(self, obj):
        try:
            if obj.adjunto:
                return obj.adjunto.url
            if obj.imagen:
                return obj.imagen.url
        except FileNotFoundError:
            return None
        return None

    def get_extension(self, obj):
        extension = ''
        try:
            if obj.adjunto and obj.adjunto.url:
                extension = obj.adjunto.url.split('.')[-1]
            if obj.imagen and obj.imagen.url:
                extension = obj.imagen.url.split('.')[-1]
            return extension.title()
        except FileNotFoundError:
            return extension

    def get_size(self, obj):
        try:
            if obj.adjunto:
                return obj.adjunto.size
            if obj.imagen:
                return obj.imagen.size
        except FileNotFoundError:
            return None
        return None

    class Meta:
        model = CotizacionComponenteAdjunto
        fields = [
            'id',
            'nombre_adjunto',
            'extension',
            'adjunto_url',
            'size',
            'adjunto',
            'imagen',
            'cotizacion_componente',
            'creado_por',
            'imagen_thumbnail',
        ]


class ItemCotizacionComponenteSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    forma_pago_nombre = serializers.CharField(source='forma_pago.forma', read_only=True)
    canal_nombre = serializers.CharField(source='forma_pago.canal.nombre', read_only=True)
    cotizacion_nro_consecutivo = serializers.CharField(source='cotizacion.nro_consecutivo', read_only=True)
    cotizacion_fecha = serializers.DateTimeField(source='cotizacion.created', read_only=True)

    def update(self, instance, validated_data):
        cantidad = validated_data.get('cantidad')
        dias_entrega = validated_data.get('dias_entrega')
        from .services import cotizacion_componentes_item_actualizar_item
        item = cotizacion_componentes_item_actualizar_item(
            item_componente_id=instance.id,
            cantidad=cantidad,
            dias_entrega=dias_entrega,
        )
        return item

    class Meta:
        model = ItemCotizacionComponente
        fields = [
            'url',
            'id',
            'cotizacion_nro_consecutivo',
            'cotizacion_fecha',
            'componente_eurobelt',
            'posicion',
            'banda_eurobelt',
            'transporte_tipo',
            'cotizacion',
            'articulo_catalogo',
            'forma_pago',
            'forma_pago_nombre',
            'canal_nombre',
            'dias_entrega',
            'descripcion',
            'tasa_cambio_a_dolares',
            'tasa_cambio_a_pesos',
            'referencia',
            'unidad_medida',
            'cantidad',
            'precio_unitario',
            'valor_total',
            'descripcion_ori',
            'referencia_ori',
            'unidad_medida_ori',
            'costo_ori',
            'precio_unitario_ori',
            'verificar_personalizacion',
            'verificada_personalizacion',
            'verificacion_solicitada',
        ]
        extra_kwargs = {
            'descripcion_ori': {'read_only': True},
            'referencia_ori': {'read_only': True},
            'unidad_medida_ori': {'read_only': True},
            'costo_ori': {'read_only': True},
            'precio_unitario_ori': {'read_only': True},
            'verificar_personalizacion': {'read_only': True},
            'verificada_personalizacion': {'read_only': True},
            'verificacion_solicitada': {'read_only': True},
        }


class CotizacionComponenteSeguimientoSerializer(serializers.ModelSerializer):
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    tipo_seguimiento_nombre = serializers.SerializerMethodField()
    documento_cotizacion_url = serializers.SerializerMethodField()
    documento_cotizacion_extension = serializers.SerializerMethodField()
    documento_cotizacion_size = serializers.SerializerMethodField()
    documento_cotizacion_version = serializers.SerializerMethodField()

    def get_tipo_seguimiento_nombre(self, obj):
        return obj.get_tipo_seguimiento_display()

    def get_documento_cotizacion_version(self, obj):
        try:
            if obj.documento_cotizacion:
                return obj.documento_cotizacion.version
            return None
        except FileNotFoundError:
            return None

    def get_documento_cotizacion_url(self, obj):
        try:
            if obj.documento_cotizacion:
                return obj.documento_cotizacion.pdf_cotizacion.url
            return None
        except FileNotFoundError:
            return None

    def get_documento_cotizacion_extension(self, obj):
        extension = ''
        try:
            if obj.documento_cotizacion:
                extension = obj.documento_cotizacion.pdf_cotizacion.url.split('.')[-1]
            return extension.title()
        except FileNotFoundError:
            return None

    def get_documento_cotizacion_size(self, obj):
        try:
            if obj.documento_cotizacion:
                return obj.documento_cotizacion.pdf_cotizacion.size
            return None
        except FileNotFoundError:
            return None

    class Meta:
        model = CotizacionComponenteSeguimiento
        fields = [
            'id',
            'cotizacion_componente',
            'tipo_seguimiento_nombre',
            'tipo_seguimiento',
            'descripcion',
            'documento_cotizacion',
            'documento_cotizacion_url',
            'documento_cotizacion_extension',
            'documento_cotizacion_size',
            'documento_cotizacion_version',
            'creado_por',
            'creado_por_username',
            'fecha',
        ]


class CotizacionComponenteSerializer(serializers.ModelSerializer):
    cantidad_items = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    valor_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    cliente_nit = serializers.CharField(source='cliente.nit', read_only=True)
    pais_nombre = serializers.CharField(source='ciudad.departamento.pais.nombre', read_only=True)
    departamento_nombre = serializers.CharField(source='ciudad.departamento.nombre', read_only=True)
    ciudad_nombre = serializers.CharField(source='ciudad.nombre', read_only=True)
    contacto_nombres = serializers.CharField(source='contacto.nombres', read_only=True)
    contacto_apellidos = serializers.CharField(source='contacto.apellidos', read_only=True)
    estado_display = serializers.SerializerMethodField()
    version = serializers.SerializerMethodField()
    responsable_username = serializers.CharField(source='responsable.username', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.get_full_name', read_only=True)
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    fecha_verificacion_proximo_seguimiento = serializers.DateField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
        allow_null=True,
        required=False
    )

    def get_version(self, obj):
        return None

    def get_estado_display(self, obj):
        return obj.get_estado_display()

    def update(self, instance, validated_data):
        print('entro a update')
        return super().update(instance, validated_data)

    class Meta:
        model = CotizacionComponente
        fields = [
            'url',
            'id',
            'created',
            'valor_total',
            'observaciones',
            'cantidad_items',
            'color_seguimiento',
            'porcentaje_seguimineto',
            'nro_consecutivo',
            'fecha_verificacion_cambio_estado',
            'fecha_verificacion_proximo_seguimiento',
            'moneda',
            'version',
            'cliente',
            'cliente_nombre',
            'cliente_nit',
            'contacto',
            'contacto_nombres',
            'contacto_apellidos',
            'adjuntos',
            'ciudad',
            'ciudad_nombre',
            'departamento_nombre',
            'pais_nombre',
            'estado',
            'responsable_nombre',
            'responsable_username',
            'creado_por_username',
            'razon_rechazo',
            'estado_display',
            'envios_emails',
            'seguimientos',
            'items',
            'orden_compra_nro',
            'orden_compra_fecha',
            'orden_compra_valor',
        ]
        read_only_fields = [
            'orden_compra_nro',
            'orden_compra_fecha',
            'orden_compra_valor',
            'created',
            'responsable_username',
            'creado_por_username',
            'envios_emails',
            'items',
            'seguimientos',
            'adjuntos',
        ]
        extra_kwargs = {
            'observaciones': {'allow_blank': True},
            'razon_rechazo': {'allow_blank': True},
        }


class CotizacionComponenteTuberiaVentasSerializer(serializers.ModelSerializer):
    cantidad_items = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    valor_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    responsable_username = serializers.CharField(source='responsable.username', read_only=True)
    responsable_nombre = serializers.CharField(source='responsable.get_full_name', read_only=True)
    colaborador = serializers.IntegerField(source='responsable.mi_colaborador.id', read_only=True)
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)

    class Meta:
        model = CotizacionComponente
        fields = [
            'url',
            'id',
            'created',
            'valor_total',
            'cantidad_items',
            'color_seguimiento',
            'porcentaje_seguimineto',
            'nro_consecutivo',
            'fecha_verificacion_cambio_estado',
            'fecha_verificacion_proximo_seguimiento',
            'moneda',
            'cliente',
            'cliente_nombre',
            'estado',
            'get_estado_display',
            'colaborador',
            'responsable_nombre',
            'responsable_username',
            'creado_por_username'
        ]
        read_only_fields = fields


class CotizacionComponenteConDetalleSerializer(CotizacionComponenteSerializer):
    items = ItemCotizacionComponenteSerializer(
        many=True,
        read_only=True,
        context={
            'quitar_campos': [
                'cotizacion_nro_consecutivo',
                'cotizacion_fecha'
            ]
        }
    )
    adjuntos = CotizacionComponenteAdjuntoSerializer(many=True, read_only=True)
    envios_emails = CotizacionComponenteEnvioSerializer(many=True, read_only=True)
    seguimientos = CotizacionComponenteSeguimientoSerializer(many=True, read_only=True)

    def get_version(self, obj):
        return obj.pdf.version if obj.pdf else None
