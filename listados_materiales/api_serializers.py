from rest_framework import serializers

from .models import ItemLiteralDiseno


class ItemLiteralDisenoSerializer(serializers.ModelSerializer):
    cantidad = serializers.DecimalField(max_digits=10, decimal_places=2)
    cantidad_reservada_inventario = serializers.DecimalField(max_digits=10, decimal_places=2)
    cantidad_a_comprar = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = ItemLiteralDiseno
        fields = [
            'id',
            'literal',
            'codigo',
            'item_cguno',
            'descripcion',
            'material',
            'cantidad_material',
            'cantidad_a_comprar',
            'cantidad',
            'cantidad_reservada_inventario',
            'proceso',
            'acabado',
            'eliminado',
            'fecha_requerido',
        ]
        extra_kwargs = {
            'item_cguno': {'allow_null': True},
        }
