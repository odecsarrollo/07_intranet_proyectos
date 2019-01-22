from django.utils import timezone

from rest_framework import serializers

from .models import Cotizacion, SeguimientoCotizacion, ArchivoCotizacion


class CotizacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    valor_orden_compra_mes = serializers.DecimalField(decimal_places=2, max_digits=20, read_only=True)
    responsable_actual = serializers.CharField(source='responsable.username', read_only=True)
    responsable_actual_nombre = serializers.CharField(source='responsable.get_full_name', read_only=True)
    contacto_cliente_nombre = serializers.CharField(source='contacto_cliente.full_nombre', read_only=True)
    id_proyecto = serializers.CharField(source='mi_proyecto.id_proyecto', read_only=True)
    mi_literal_id_literal = serializers.CharField(source='mi_literal.id_literal', read_only=True)
    mi_literal_id_proyecto = serializers.CharField(source='mi_literal.proyecto.id_proyecto', read_only=True)
    mi_literal_proyecto_id = serializers.CharField(source='mi_literal.proyecto.id', read_only=True)
    orden_compra_fecha = serializers.DateTimeField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%d', 'iso-8601'],
        allow_null=True,
        required=False
    )
    fecha_entrega_pactada = serializers.DateTimeField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%d', 'iso-8601'],
        allow_null=True,
        required=False
    )
    fecha_entrega_pactada_cotizacion = serializers.DateTimeField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%d', 'iso-8601'],
        allow_null=True,
        required=False
    )
    fecha_limite_segumiento_estado = serializers.DateTimeField(
        format="%Y-%m-%d",
        input_formats=['%Y-%m-%d', 'iso-8601'],
        allow_null=True,
        required=False
    )
    color_tuberia_ventas = serializers.SerializerMethodField()
    porcentaje_tuberia_ventas = serializers.SerializerMethodField()

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
            'responsable',
            'origen_cotizacion',
            'responsable_actual',
            'responsable_actual_nombre',
            'nro_cotizacion',
            'unidad_negocio',
            'cliente',
            'cliente_nombre',
            'descripcion_cotizacion',
            'contacto_cliente',
            'contacto_cliente_nombre',
            'contacto',
            'estado',
            'estado_observacion_adicional',
            'observacion',
            'valor_ofertado',
            'valor_orden_compra',
            'valor_orden_compra_mes',
            'orden_compra_nro',
            'costo_presupuestado',
            'abrir_carpeta',
            'mi_proyecto',
            'mi_literal',
            'mi_literal_id_literal',
            'mi_literal_id_proyecto',
            'mi_literal_proyecto_id',
            'id_proyecto',
            'orden_compra_fecha',
            'fecha_cambio_estado',
            'fecha_entrega_pactada',
            'fecha_entrega_pactada_cotizacion',
            'fecha_limite_segumiento_estado',
            'crear_literal',
            'crear_literal_id_proyecto',
            'color_tuberia_ventas',
            'porcentaje_tuberia_ventas',
        ]
        extra_kwargs = {
            'mi_proyecto': {'read_only': True},
            'mi_literal': {'read_only': True},
            'responsable_actual': {'read_only': True},
            'fecha_cambio_estado': {'read_only': True},
            'contacto': {'allow_null': True},
            'origen_cotizacion': {'allow_null': True},
            'estado_observacion_adicional': {'allow_null': True},
            'fecha_limite_segumiento_estado': {'allow_null': True},
        }


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
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)

    def get_archivo_url(self, obj):
        if obj.archivo:
            return obj.archivo.url
        return None

    class Meta:
        model = ArchivoCotizacion
        fields = [
            'url',
            'id',
            'cotizacion',
            'created',
            'nombre_archivo',
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
