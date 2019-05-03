from rest_framework import viewsets
from .models import (
    TipoBandaBandaEurobelt,
    MaterialBandaEurobelt,
    ColorBandaEurobelt,
    SerieBandaEurobelt,
    ComponenteBandaEurobelt,
    GrupoEnsambladoBandaEurobelt,
    CategoriaComponenteBandaEurobelt
)
from .api_serializers import (
    TipoBandaSerializer,
    MaterialSerializer,
    ColorSerializer,
    SerieSerializer,
    ComponenteSerializer,
    GrupoEnsambladoSerializer,
    CategoriaSerializer
)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = CategoriaComponenteBandaEurobelt.objects.select_related(
        'moneda'
    ).all()
    serializer_class = CategoriaSerializer


class TipoBandaViewSet(viewsets.ModelViewSet):
    queryset = TipoBandaBandaEurobelt.objects.all()
    serializer_class = TipoBandaSerializer


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = MaterialBandaEurobelt.objects.all()
    serializer_class = MaterialSerializer


class ColorViewSet(viewsets.ModelViewSet):
    queryset = ColorBandaEurobelt.objects.all()
    serializer_class = ColorSerializer


class SerieViewSet(viewsets.ModelViewSet):
    queryset = SerieBandaEurobelt.objects.all()
    serializer_class = SerieSerializer


class ComponenteViewSet(viewsets.ModelViewSet):
    queryset = ComponenteBandaEurobelt.objects.select_related(
        'tipo_banda',
        'categoria',
        'color',
        'material'
    ).prefetch_related(
        'series_compatibles'
    ).all()
    serializer_class = ComponenteSerializer


class GrupoEnsambladoViewSet(viewsets.ModelViewSet):
    queryset = GrupoEnsambladoBandaEurobelt.objects.all()
    serializer_class = GrupoEnsambladoSerializer
