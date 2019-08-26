from rest_framework import serializers

from .models import CotizacionComponente, ItemCotizacionComponente, CotizacionComponenteAdjunto


class CotizacionComponenteAdjuntoSerializer(serializers.ModelSerializer):
    adjunto_url = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    imagen_thumbnail = serializers.ImageField(read_only=True)

    def get_adjunto_url(self, obj):
        if obj.adjunto:
            return obj.adjunto.url
        if obj.imagen:
            return obj.imagen.url
        return None

    def get_extension(self, obj):
        extension = ''
        if obj.adjunto:
            extension = obj.adjunto.url.split('.')[-1]
        if obj.imagen:
            extension = obj.imagen.url.split('.')[-1]
        return extension.title()

    def get_size(self, obj):
        if obj.adjunto:
            return obj.adjunto.size
        if obj.imagen:
            return obj.imagen.size
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


class ItemCotizacionComponenteSerializer(serializers.ModelSerializer):
    forma_pago_nombre = serializers.CharField(source='forma_pago.forma', read_only=True)
    canal_nombre = serializers.CharField(source='forma_pago.canal.nombre', read_only=True)

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
            'componente_eurobelt',
            'posicion',
            'banda_eurobelt',
            'articulo_catalogo',
            'forma_pago',
            'forma_pago_nombre',
            'canal_nombre',
            'dias_entrega',
            'descripcion',
            'referencia',
            'unidad_medida',
            'cantidad',
            'precio_unitario',
            'valor_total',
        ]


class CotizacionComponenteSerializer(serializers.ModelSerializer):
    cantidad_items = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    valor_total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    pais_nombre = serializers.CharField(source='ciudad.departamento.pais.nombre', read_only=True)
    departamento_nombre = serializers.CharField(source='ciudad.departamento.nombre', read_only=True)
    ciudad_nombre = serializers.CharField(source='ciudad.nombre', read_only=True)
    contacto_nombres = serializers.CharField(source='contacto.nombres', read_only=True)
    contacto_apellidos = serializers.CharField(source='contacto.apellidos', read_only=True)
    estado_display = serializers.SerializerMethodField()

    def get_estado_display(self, obj):
        return obj.get_estado_display()

    class Meta:
        model = CotizacionComponente
        fields = [
            'url',
            'id',
            'valor_total',
            'observaciones',
            'cantidad_items',
            'nro_consecutivo',
            'cliente',
            'cliente_nombre',
            'contacto',
            'contacto_nombres',
            'contacto_apellidos',
            'adjuntos',
            'ciudad',
            'ciudad_nombre',
            'departamento_nombre',
            'pais_nombre',
            'estado',
            'estado_display',
            'items',
        ]
        extra_kwargs = {
            'items': {'read_only': True},
            'adjuntos': {'read_only': True},
            'observaciones': {'allow_blank': True},
        }


class CotizacionComponenteConDetalleSerializer(CotizacionComponenteSerializer):
    items = ItemCotizacionComponenteSerializer(many=True, read_only=True)
    adjuntos = CotizacionComponenteAdjuntoSerializer(many=True, read_only=True)
