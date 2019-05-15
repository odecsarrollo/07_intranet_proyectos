from rest_framework import viewsets

from .models import (
    ItemVentaCatalogo
)
from .api_serializers import (
    ItemVentaCatalogoSerializer
)


class ItemVentaCatalogoViewSet(viewsets.ModelViewSet):
    queryset = ItemVentaCatalogo.objects.select_related(
        'sistema_informacion',
        'item_sistema_informacion',
        'proveedor_importacion',
        'margen',
        'margen__proveedor',
        'margen__proveedor__moneda',
    ).all()
    serializer_class = ItemVentaCatalogoSerializer
