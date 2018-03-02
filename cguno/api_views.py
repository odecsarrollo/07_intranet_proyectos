from intranet_proyectos.utils_queryset import query_varios_campos
from rest_framework import viewsets
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from .models import ColaboradorBiable, ItemsLiteralBiable, ItemsBiable, ColaboradorCentroCosto
from .api_serializers import ColaboradorBiableSerializer, ItemsLiteralBiableSerializer, ItemsBiableSerializer, \
    ColaboradorCentroCostoSerializer


class ColaboradorCentroCostoViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorCentroCosto.objects.all()
    serializer_class = ColaboradorCentroCostoSerializer


class ColaboradorBiableViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorBiable.objects.select_related('usuario', 'cargo', 'centro_costo').all()
    serializer_class = ColaboradorBiableSerializer

    def perform_destroy(self, instance):
        usuario = instance.usuario
        if usuario:
            usuario.is_active = False
            usuario.save()
        super().perform_destroy(instance)

    @list_route(methods=['get'])
    def mi_colaborador(self, request):
        qs = self.get_queryset().filter(
            usuario_id=request.user.id
        ).distinct()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def en_proyectos(self, request):
        lista = self.queryset.filter(en_proyectos=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def en_proyectos_para_gestion_horas_trabajadas(self, request):
        lista = self.queryset.filter(en_proyectos=True, autogestion_horas_trabajadas=False).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def en_proyectos_autogestion_horas_trabajadas(self, request):
        lista = self.queryset.filter(en_proyectos=True, autogestion_horas_trabajadas=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def crear_usuario(self, request, pk=None):
        colaborador = self.get_object()
        if (not colaborador.usuario):
            colaborador.create_user()
        serializer = self.get_serializer(colaborador)
        return Response(serializer.data)

    @detail_route(methods=['post'])
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

    @list_route(http_method_names=['get', ])
    def listar_items_x_literal(self, request):
        literal_id = request.GET.get('id_literal')
        lista = self.queryset.filter(literal_id=literal_id).order_by('item_biable__descripcion').all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class ItemBiableViewSet(viewsets.ModelViewSet):
    queryset = ItemsBiable.objects.all()
    serializer_class = ItemsBiableSerializer
    http_method_names = ['get', ]

    @list_route(http_method_names=['get', ])
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
