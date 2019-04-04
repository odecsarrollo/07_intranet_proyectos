from rest_framework import viewsets
from .models import (
    Ciudad,
    Departamento,
    Pais
)
from .api_serializers import (
    PaisSerializer,
    DepartamentoSerializer,
    CiudadSerializer
)


class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer


class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.select_related('pais').all()
    serializer_class = DepartamentoSerializer


class CiudadViewSet(viewsets.ModelViewSet):
    queryset = Ciudad.objects.select_related('departamento', 'departamento__pais').all()
    serializer_class = CiudadSerializer
