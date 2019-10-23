from rest_framework import viewsets
from .models import (
    MonedaCambio,
    ProveedorImportacion,
    MargenProvedor
)
from .api_serializers import (
    MonedaCambioSerializer,
    ProveedorImportacionSerializer,
    MargenProvedorSerializer
)

from reversion.views import RevisionMixin


class MonedaCambioViewSet(RevisionMixin, viewsets.ModelViewSet):
    queryset = MonedaCambio.objects.all()
    serializer_class = MonedaCambioSerializer


class ProveedorImportacionViewSet(RevisionMixin, viewsets.ModelViewSet):
    queryset = ProveedorImportacion.objects.select_related('moneda').all()
    serializer_class = ProveedorImportacionSerializer


class MargenProvedorViewSet(RevisionMixin, viewsets.ModelViewSet):
    queryset = MargenProvedor.objects.select_related('proveedor', 'categoria').all()
    serializer_class = MargenProvedorSerializer
