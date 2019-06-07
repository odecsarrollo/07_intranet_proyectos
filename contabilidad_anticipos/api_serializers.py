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
            'email_copia_default',
            'firma',
            'encabezado',
        ]


class ProformaAnticipoSerializer(serializers.ModelSerializer):

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
        email_destinatario = validated_data.get('email_destinatario', None)
        email_destinatario_dos = validated_data.get('email_destinatario_dos', None)
        impuesto = validated_data.get('impuesto', 0)
        tipo_documento = validated_data.get('tipo_documento')
        divisa = validated_data.get('divisa')
        nit = validated_data.get('nit')
        nombre_cliente = validated_data.get('nombre_cliente')
        fecha = validated_data.get('fecha')
        nro_orden_compra = validated_data.get('nro_orden_compra')
        condicion_pago = validated_data.get('condicion_pago')
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
            'nombre_cliente',
            'estado',
            'email_destinatario',
            'email_destinatario_dos',
            'cobrado',
            'fecha',
            'nro_orden_compra',
            'condicion_pago',
            'impuesto',
        ]
        extra_kwargs = {
            'nro_consecutivo': {'read_only': True},
            'informacion_locatario': {'allow_blank': True},
        }


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
