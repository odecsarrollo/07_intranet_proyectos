from rest_framework import serializers

from .models import Proyecto, Literal


class LiteralSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='proyecto.cliente.nombre', read_only=True)
    proyecto_abierto = serializers.BooleanField(source='proyecto.abierto', read_only=True)
    id_proyecto = serializers.CharField(source='proyecto.id_proyecto', read_only=True)
    proyecto_nombre = serializers.CharField(source='proyecto.nombre', read_only=True)
    costo_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_mano_obra_inicial = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_horas_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_horas_mano_obra_inicial = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
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

    class Meta:
        model = Literal
        fields = [
            'url',
            'id',
            'id_literal',
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
            'valor_cliente',
            'cotizacion_nro',
        ]


class ProyectoSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    costo_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_horas_mano_obra = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    costo_mano_obra_inicial = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cantidad_horas_mano_obra_inicial = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    cotizacion_nro = serializers.SerializerMethodField()
    costo_presupuestado = serializers.DecimalField(source='cotizacion.costo_presupuestado', read_only=True,
                                                   max_digits=20, decimal_places=2)
    valor_cliente = serializers.DecimalField(source='cotizacion.valor_orden_compra', read_only=True,
                                             max_digits=20, decimal_places=2)
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

    def get_cotizacion_nro(self, obj):
        if obj.cotizacion:
            return '%s-%s' % (obj.cotizacion.unidad_negocio, obj.cotizacion.nro_cotizacion)
        return None

    class Meta:
        model = Proyecto
        fields = [
            'url',
            'id',
            'id_proyecto',
            'fecha_prometida',
            'abierto',
            'costo_materiales',
            'en_cguno',
            'valor_cliente',
            'costo_presupuestado',
            'costo_mano_obra',
            'costo_mano_obra_inicial',
            'cantidad_horas_mano_obra',
            'cantidad_horas_mano_obra_inicial',
            'orden_compra_nro',
            'orden_compra_fecha',
            'fecha_entrega_pactada',
            'cotizacion',
            'cotizacion_nro',
            'nombre',
            'cliente',
            'cliente_nombre',
        ]
        extra_kwargs = {'cliente': {'allow_null': True}}
