from rest_framework import serializers

from .models import ItemsLiteralDetalle
from cargues_catalogos.api_serializers import ItemsCatalogoSerializer


class ItemsLiteralDetalleSerializer(serializers.ModelSerializer):
    item = ItemsCatalogoSerializer(read_only=True)

    class Meta:
        model = ItemsLiteralDetalle
        fields = [
            'id',
            'lapso',
            'literal',
            'item',
            'cantidad',
            'costo_total',
        ]
