from rest_framework import serializers

from .models import CotizacionComponente, ItemCotizacionComponente


class ItemCotizacionComponenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCotizacionComponente
        fields = [
            'url',
            'id',
            'componente_eurobelt',
            'banda_eurobelt',
            'articulo_catalogo',
            'forma_pago',
            'dias_entrega',
            'descripcion',
            'referencia',
            'unidad_medida',
            'cantidad',
            'precio_unitario',
            'valor_total',
        ]


class CotizacionComponenteSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    pais_nombre = serializers.CharField(source='ciudad.departamento.pais.nombre', read_only=True)
    departamento_nombre = serializers.CharField(source='ciudad.departamento.nombre', read_only=True)
    ciudad_nombre = serializers.CharField(source='ciudad.nombre', read_only=True)
    contacto_nombres = serializers.CharField(source='contacto.nombres', read_only=True)
    contacto_apellidos = serializers.CharField(source='contacto.apellidos', read_only=True)

    class Meta:
        model = CotizacionComponente
        fields = [
            'url',
            'id',
            'nro_consecutivo',
            'cliente',
            'cliente_nombre',
            'contacto',
            'contacto_nombres',
            'contacto_apellidos',
            'ciudad',
            'ciudad_nombre',
            'departamento_nombre',
            'pais_nombre',
            'estado',
            'version',
        ]
