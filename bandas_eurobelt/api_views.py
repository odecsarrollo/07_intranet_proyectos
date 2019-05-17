from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .models import (
    TipoBandaBandaEurobelt,
    MaterialBandaEurobelt,
    ColorBandaEurobelt,
    SerieBandaEurobelt,
    ComponenteBandaEurobelt,
    GrupoEnsambladoBandaEurobelt,
    ConfiguracionNombreAutomatico,
    CategoriaDosComponenteBandaEurobelt
)
from .api_serializers import (
    TipoBandaSerializer,
    MaterialSerializer,
    ColorSerializer,
    SerieSerializer,
    ComponenteSerializer,
    GrupoEnsambladoSerializer,
    ConfiguracionNombreAutomaticoSerializer,
    CategoriaDosSerializer,
    CategoriaDosConDetalleSerializer
)


class CategoriaDosViewSet(viewsets.ModelViewSet):
    queryset = CategoriaDosComponenteBandaEurobelt.objects.prefetch_related('categorias').all()
    serializer_class = CategoriaDosSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CategoriaDosConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CategoriaDosConDetalleSerializer
        return super().update(request, *args, **kwargs)

    @detail_route(methods=['post'])
    def adicionar_quitar_categoria_producto(self, request, pk=None):
        from .services import categoria_dos_adicionar_quitar_relacion_categoria_producto
        categoria_dos = self.get_object()
        categoria_producto_id = self.request.POST.get('categoria_producto_id', None)
        categoria_dos = categoria_dos_adicionar_quitar_relacion_categoria_producto(
            categoria_dos_id=categoria_dos.id,
            categoria_producto_id=categoria_producto_id
        )
        self.serializer_class = CategoriaDosConDetalleSerializer
        serializer = self.get_serializer(categoria_dos)
        return Response(serializer.data)


class ConfiguracionNombreAutomaticoViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionNombreAutomatico.objects.all()
    serializer_class = ConfiguracionNombreAutomaticoSerializer


class TipoBandaViewSet(viewsets.ModelViewSet):
    queryset = TipoBandaBandaEurobelt.objects.prefetch_related('categorias').all()
    serializer_class = TipoBandaSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CategoriaDosConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CategoriaDosConDetalleSerializer
        return super().update(request, *args, **kwargs)

    @detail_route(methods=['post'])
    def adicionar_quitar_categoria_producto(self, request, pk=None):
        from .services import tipos_banda_adicionar_quitar_relacion_categoria_producto
        tipo_banda = self.get_object()
        categoria_producto_id = self.request.POST.get('categoria_producto_id', None)
        tipo_banda = tipos_banda_adicionar_quitar_relacion_categoria_producto(
            tipo_banda_id=tipo_banda.id,
            categoria_producto_id=categoria_producto_id
        )
        self.serializer_class = CategoriaDosConDetalleSerializer
        serializer = self.get_serializer(tipo_banda)
        return Response(serializer.data)


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
        'categoria_dos',
        'color',
        'material'
    ).prefetch_related(
        'series_compatibles'
    ).all()
    serializer_class = ComponenteSerializer


class GrupoEnsambladoViewSet(viewsets.ModelViewSet):
    queryset = GrupoEnsambladoBandaEurobelt.objects.all()
    serializer_class = GrupoEnsambladoSerializer
