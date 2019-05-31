from rest_framework import serializers

from .models import (
    ProformaAnticipo,
    ProformaAnticipoItem,
    ProformaConfiguracion
)


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
            'firma',
            'encabezado',
        ]


class ProformaAnticipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaAnticipo
        fields = [
            'url',
            'id',
            'cliente',
            'nro_consecutivo',
            'informacion_locatario',
            'informacion_cliente',
            'divisa',
            'nit',
            'nombre_cliente',
            'fecha',
            'nro_orden_cobro',
            'condicion_pago',
        ]


class ProformaAnticipoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProformaAnticipoItem
        fields = [
            'url',
            'id',
            'proforma_anticipo',
            'descripcion',
            'cantidad',
            'valor_unitario',
        ]
