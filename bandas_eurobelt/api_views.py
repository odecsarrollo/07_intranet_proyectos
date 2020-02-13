from django.db.models import Sum, OuterRef, Subquery, F, DecimalField, ExpressionWrapper
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from intranet_proyectos.utils_queryset import query_varios_campos
from .models import (
    TipoBandaBandaEurobelt,
    MaterialBandaEurobelt,
    ColorBandaEurobelt,
    SerieBandaEurobelt,
    ComponenteBandaEurobelt,
    GrupoEnsambladoBandaEurobelt,
    CategoriaDosComponenteBandaEurobelt,
    BandaEurobelt,
    BandaEurobeltCostoEnsamblado,
    ConfiguracionBandaEurobelt,
    EnsambladoBandaEurobelt
)
from .api_serializers import (
    TipoBandaSerializer,
    MaterialSerializer,
    ColorSerializer,
    SerieSerializer,
    ComponenteSerializer,
    GrupoEnsambladoSerializer,
    CategoriaDosSerializer,
    CategoriaDosConDetalleSerializer,
    BandaEurobeltCostoEnsambladoSerializer,
    ConfiguracionBandaEurobeltSerializer,
    EnsambladoBandaEurobeltSerializer,
    BandaEurobeltSerializer,
    BandaEurobeltConDetalleSerializer,
)


class EnsambladoBandaEurobeltViewSet(viewsets.ModelViewSet):
    queryset = EnsambladoBandaEurobelt.objects.all()
    serializer_class = EnsambladoBandaEurobeltSerializer


class ConfiguracionBandaEurobeltViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionBandaEurobelt.objects.all()
    serializer_class = ConfiguracionBandaEurobeltSerializer

    def list(self, request, *args, **kwargs):
        configuracion = ConfiguracionBandaEurobelt.objects.first()
        if not configuracion:
            ConfiguracionBandaEurobelt.objects.create()
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo crear no disponible'})

    def destroy(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo eliminar no disponible'})


class BandaEurobeltCostoEnsambladoViewSet(viewsets.ModelViewSet):
    queryset = BandaEurobeltCostoEnsamblado.objects.all()
    serializer_class = BandaEurobeltCostoEnsambladoSerializer

    def list(self, request, *args, **kwargs):
        costo = BandaEurobeltCostoEnsamblado.objects.filter(
            con_aleta=False,
            con_empujador=False,
            con_torneado=False
        )

        if not costo.exists():
            BandaEurobeltCostoEnsamblado.objects.create(
                con_aleta=False,
                con_empujador=False,
                con_torneado=False
            )

        costo = BandaEurobeltCostoEnsamblado.objects.filter(
            con_aleta=True,
            con_empujador=False,
            con_torneado=False
        )

        if not costo.exists():
            BandaEurobeltCostoEnsamblado.objects.create(
                con_aleta=True,
                con_empujador=False,
                con_torneado=False
            )

        costo = BandaEurobeltCostoEnsamblado.objects.filter(
            con_aleta=True,
            con_empujador=True,
            con_torneado=False
        )

        if not costo.exists():
            BandaEurobeltCostoEnsamblado.objects.create(
                con_aleta=True,
                con_empujador=True,
                con_torneado=False
            )

        costo = BandaEurobeltCostoEnsamblado.objects.filter(
            con_aleta=True,
            con_empujador=True,
            con_torneado=True
        )

        if not costo.exists():
            BandaEurobeltCostoEnsamblado.objects.create(
                con_aleta=True,
                con_empujador=True,
                con_torneado=True
            )

        costo = BandaEurobeltCostoEnsamblado.objects.filter(
            con_aleta=True,
            con_empujador=False,
            con_torneado=True
        )

        if not costo.exists():
            BandaEurobeltCostoEnsamblado.objects.create(
                con_aleta=True,
                con_empujador=False,
                con_torneado=True
            )

        costo = BandaEurobeltCostoEnsamblado.objects.filter(
            con_aleta=False,
            con_empujador=True,
            con_torneado=False
        )

        if not costo.exists():
            BandaEurobeltCostoEnsamblado.objects.create(
                con_aleta=False,
                con_empujador=True,
                con_torneado=False
            )

        costo = BandaEurobeltCostoEnsamblado.objects.filter(
            con_aleta=False,
            con_empujador=True,
            con_torneado=True
        )

        if not costo.exists():
            BandaEurobeltCostoEnsamblado.objects.create(
                con_aleta=False,
                con_empujador=True,
                con_torneado=True
            )

        costo = BandaEurobeltCostoEnsamblado.objects.filter(
            con_aleta=False,
            con_empujador=False,
            con_torneado=True
        )

        if not costo.exists():
            BandaEurobeltCostoEnsamblado.objects.create(
                con_aleta=False,
                con_empujador=False,
                con_torneado=True
            )
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo crear no disponible'})

    def destroy(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo eliminar no disponible'})


class BandaEurobeltViewSet(viewsets.ModelViewSet):
    queryset = BandaEurobelt.objects.all()
    serializer_class = BandaEurobeltSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = BandaEurobeltConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = BandaEurobeltConDetalleSerializer
        return super().update(request, *args, **kwargs)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_parametro(self, request):
        parametro = request.GET.get('parametro')
        search_fields = ['nombre', 'referencia']
        qs = query_varios_campos(self.queryset, search_fields, parametro)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_componente(self, request, pk=None):
        from .services import banda_eurobelt_adicionar_componente
        banda = self.get_object()
        componente_id = self.request.POST.get('componente_id')
        cantidad = int(self.request.POST.get('cantidad'))
        cortado_a = self.request.POST.get('cortado_a')
        banda = banda_eurobelt_adicionar_componente(
            banda_id=banda.id,
            componente_id=componente_id,
            cantidad=cantidad,
            cortado_a=cortado_a
        )
        self.serializer_class = BandaEurobeltConDetalleSerializer
        serializer = self.get_serializer(banda)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def quitar_componente(self, request, pk=None):
        banda = self.get_object()
        from .services import banda_eurobelt_quitar_componente
        ensamblado_id = self.request.POST.get('ensamblado_id')
        banda = banda_eurobelt_quitar_componente(banda_id=banda.id, ensamblado_id=ensamblado_id)
        self.serializer_class = BandaEurobeltConDetalleSerializer
        serializer = self.get_serializer(banda)
        return Response(serializer.data)


class CategoriaDosViewSet(viewsets.ModelViewSet):
    queryset = CategoriaDosComponenteBandaEurobelt.objects.prefetch_related('categorias').all()
    serializer_class = CategoriaDosSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CategoriaDosConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CategoriaDosConDetalleSerializer
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
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


class TipoBandaViewSet(viewsets.ModelViewSet):
    queryset = TipoBandaBandaEurobelt.objects.prefetch_related('categorias').all()
    serializer_class = TipoBandaSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CategoriaDosConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CategoriaDosConDetalleSerializer
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
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
    queryset = ComponenteBandaEurobelt.objects.all()
    serializer_class = ComponenteSerializer

    def list(self, request, *args, **kwargs):
        qs = self.queryset
        for componente in qs.all():
            componente.set_nombre()
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def adicionar_quitar_serie_compatible(self, request, pk=None):
        from .services import componente_banda_eurobelt_adicionar_quitar_serie_compatible
        componente = self.get_object()
        serie_id = self.request.POST.get('serie_id', None)
        componente = componente_banda_eurobelt_adicionar_quitar_serie_compatible(
            componente_id=componente.id,
            serie_id=serie_id
        )
        serializer = self.get_serializer(componente)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_parametro(self, request):
        parametro = request.GET.get('parametro')
        search_fields = ['nombre', 'referencia']
        qs = query_varios_campos(self.queryset, search_fields, parametro)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class GrupoEnsambladoViewSet(viewsets.ModelViewSet):
    queryset = GrupoEnsambladoBandaEurobelt.objects.all()
    serializer_class = GrupoEnsambladoSerializer
