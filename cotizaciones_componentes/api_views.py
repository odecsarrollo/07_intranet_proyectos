from rest_framework import viewsets
from .models import CotizacionComponente, ItemCotizacionComponente
from .api_serializers import CotizacionComponenteSerializer, ItemCotizacionComponenteSerializer


class CotizacionComponenteViewSet(viewsets.ModelViewSet):
    queryset = CotizacionComponente.objects.select_related(
        'cliente',
        'ciudad',
        'ciudad__departamento',
        'ciudad__departamento__pais',
        'contacto',
        'contacto__creado_por'
    ).all()
    serializer_class = CotizacionComponenteSerializer


class ItemCotizacionComponenteViewSet(viewsets.ModelViewSet):
    queryset = ItemCotizacionComponente.objects.all()
    serializer_class = ItemCotizacionComponenteSerializer
