from rest_framework import serializers

from .models import Cotizacion, SeguimientoCotizacion


class CotizacionSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    created_by_nombre = serializers.CharField(source='created_by.username', read_only=True)
    responsable_nombres = serializers.CharField(source='responsable.first_name', read_only=True)
    responsable_apellidos = serializers.CharField(source='responsable.last_name', read_only=True)
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

    class Meta:
        model = Cotizacion
        fields = [
            'url',
            'id',
            'created_by',
            'created_by_nombre',
            'nro_cotizacion',
            'unidad_negocio',
            'cliente',
            'cliente_nombre',
            'descripcion_cotizacion',
            'contacto',
            'estado',
            'observacion',
            'valor_ofertado',
            'valor_orden_compra',
            'orden_compra_nro',
            'costo_presupuestado',
            'responsable',
            'responsable_nombres',
            'responsable_apellidos',
            'abrir_carpeta',
            'mi_proyecto',
            'mi_literal',
            'mi_literal_id_literal',
            'mi_literal_id_proyecto',
            'mi_literal_proyecto_id',
            'id_proyecto',
            'orden_compra_fecha',
            'fecha_entrega_pactada',
            'fecha_entrega_pactada_cotizacion',
            'crear_literal',
            'crear_literal_id_proyecto',
        ]
        extra_kwargs = {
            'mi_proyecto': {'read_only': True},
            'mi_literal': {'read_only': True},
        }


class SeguimientoCotizacionSerializer(serializers.ModelSerializer):
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
        ]
        extra_kwargs = {
            'created': {'read_only': True},
            'modified': {'read_only': True},
            'creado_por': {'read_only': True},
        }
