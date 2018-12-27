from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import (
    TipoBanda,
    Material,
    Color,
    Serie,
    Componente,
    GrupoEnsamblado
)
from .api_serializers import (
    TipoBandaSerializer,
    MaterialSerializer,
    ColorSerializer,
    SerieSerializer,
    ComponenteSerializer,
    GrupoEnsambladoSerializer
)


class TipoBandaViewSet(viewsets.ModelViewSet):
    queryset = TipoBanda.objects.all()
    serializer_class = TipoBandaSerializer


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


class ColorViewSet(viewsets.ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer


class SerieViewSet(viewsets.ModelViewSet):
    queryset = Serie.objects.all()
    serializer_class = SerieSerializer


class ComponenteViewSet(viewsets.ModelViewSet):
    queryset = Componente.objects.all()
    serializer_class = ComponenteSerializer


class GrupoEnsambladoViewSet(viewsets.ModelViewSet):
    queryset = GrupoEnsamblado.objects.all()
    serializer_class = GrupoEnsambladoSerializer
