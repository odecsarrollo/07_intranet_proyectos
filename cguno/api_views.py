import json

from intranet_proyectos.utils_queryset import query_varios_campos
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    ColaboradorBiable,
    ItemsLiteralBiable,
    ItemsBiable,
    ColaboradorCentroCosto,
    ColaboradorCostoMesBiable
)
from .api_serializers import (
    ColaboradorBiableSerializer,
    ItemsLiteralBiableSerializer,
    ItemsBiableSerializer,
    ColaboradorCentroCostoSerializer,
    ColaboradorCostoMesBiableSerializer
)


class ColaboradorCentroCostoViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorCentroCosto.objects.select_related(
        'centro_costo_padre'
    ).all()
    serializer_class = ColaboradorCentroCostoSerializer


class ColaboradorBiableViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorBiable.objects.select_related(
        'usuario',
        'cargo',
        'centro_costo',
        'centro_costo__centro_costo_padre',
    ).prefetch_related(
        'literales_autorizados'
    ).all()
    serializer_class = ColaboradorBiableSerializer

    def perform_destroy(self, instance):
        usuario = instance.usuario
        if usuario:
            usuario.is_active = False
            usuario.save()
        super().perform_destroy(instance)

    @action(detail=False, methods=['get'])
    def mi_colaborador(self, request):
        qs = self.get_queryset().filter(
            usuario_id=request.user.id
        ).distinct()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def en_proyectos(self, request):
        lista = self.queryset.filter(en_proyectos=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def en_proyectos_para_gestion_horas_trabajadas(self, request):
        lista = self.queryset.filter(en_proyectos=True, autogestion_horas_trabajadas=False).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def en_proyectos_autogestion_horas_trabajadas(self, request):
        lista = self.queryset.filter(en_proyectos=True, autogestion_horas_trabajadas=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def crear_usuario(self, request, pk=None):
        colaborador = self.get_object()
        if (not colaborador.usuario):
            colaborador.create_user()
        serializer = self.get_serializer(colaborador)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def modificar_autorizacion_literal(self, request, pk=None):
        colaborador = self.get_object()
        literal_id = request.POST.get('literal_id')
        tipo = request.POST.get('tipo')
        if tipo == 'add':
            colaborador.literales_autorizados.add(literal_id)
        if tipo == 'delete':
            colaborador.literales_autorizados.remove(literal_id)
        serializer = self.get_serializer(colaborador)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_activacion(self, request, pk=None):
        colaborador = self.get_object()
        usuario = colaborador.usuario
        if usuario:
            colaborador.cambiar_activacion()
            if not usuario.is_active:
                colaborador.autogestion_horas_trabajadas = False
                colaborador.save()
        serializer = self.get_serializer(colaborador)
        return Response(serializer.data)


class ItemsLiteralBiableViewSet(viewsets.ModelViewSet):
    queryset = ItemsLiteralBiable.objects.select_related('item_biable').all()
    serializer_class = ItemsLiteralBiableSerializer
    http_method_names = []

    @action(detail=False, http_method_names=['get', ])
    def listar_items_x_literal(self, request):
        literal_id = request.GET.get('id_literal')
        lista = self.queryset.filter(literal_id=literal_id).order_by('item_biable__descripcion').all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class ItemBiableViewSet(viewsets.ModelViewSet):
    queryset = ItemsBiable.objects.all()
    serializer_class = ItemsBiableSerializer
    http_method_names = ['get', ]

    @action(detail=False, http_method_names=['get', ])
    def listar_items_x_parametro(self, request):
        parametro = request.GET.get('parametro')
        tipo_parametro = int(request.GET.get('tipo_parametro'))
        search_fields = None
        qs = None

        if (tipo_parametro == 2 and parametro.isnumeric()):
            qs = self.queryset.filter(id_item=int(parametro))

        if (tipo_parametro == 1 and len(parametro) >= 3):
            search_fields = ['descripcion', 'nombre_tercero', 'descripcion_dos']

        if (tipo_parametro == 3 and len(parametro) >= 3):
            search_fields = ['=id_referencia']

        if search_fields:
            qs = query_varios_campos(self.queryset, search_fields, parametro)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def consultar_arreglo_codigos(self, request):
        codigos = request.GET.get('codigos')
        qs = self.queryset.filter(id_item__in=json.loads(codigos))
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ColaboradorCostoMesBiableViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorCostoMesBiable.objects.select_related('centro_costo', 'colaborador').all()
    serializer_class = ColaboradorCostoMesBiableSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.calcular_costo_total()

    @action(detail=False, http_method_names=['get', ])
    def listar_x_fechas(self, request):
        fecha_inicial = request.GET.get('fecha_inicial')
        fecha_final = request.GET.get('fecha_final')
        qs = None
        if fecha_final and fecha_final:
            qs = self.queryset.filter(lapso__gte=fecha_inicial, lapso__lte=fecha_final)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
