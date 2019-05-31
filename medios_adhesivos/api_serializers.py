from rest_framework import serializers

from .models import (
    Adhesivo,
    AdhesivoMovimiento
)


class AdhesivoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.codigo

    class Meta:
        model = Adhesivo
        fields = [
            'url',
            'id',
            'codigo',
            'alto',
            'ancho',
            'color',
            'stock_min',
            'descripcion',
            'imagen',
            'tipo',
            'to_string'
        ]


class MovimientoAdhesivoSerializer(serializers.ModelSerializer):
    adhesivo_descripcion = serializers.CharField(source='adhesivo.descripcion', read_only=True)

    def create(self, validated_data):
        from .services import moviento_adhesivo_crear
        adhesivo = validated_data.pop('adhesivo')
        cantidad = validated_data.pop('cantidad')
        tipo = validated_data.pop('tipo')
        responsable = validated_data.pop('responsable')
        descripcion = validated_data.pop('descripcion')
        movimiento = moviento_adhesivo_crear(
            adhesivo_id=adhesivo.id,
            cantidad=cantidad,
            tipo=tipo,
            responsable=responsable,
            descripcion=descripcion
        )
        return movimiento

    class Meta:
        model = AdhesivoMovimiento
        fields = [
            'id',
            'tipo',
            'responsable',
            'tipo_nombre',
            'adhesivo_descripcion',
            'cantidad',
            'descripcion',
            'saldo',
            'ultimo',
            'adhesivo'
        ]
        extra_kwargs = {
            'saldo': {'read_only': True},
            'ultimo': {'read_only': True}
        }
