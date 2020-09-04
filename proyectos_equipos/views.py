from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import TipoEquipo
from .serializers import (
    EquipoProyectoConDetalleSerializer,
    EquipoProyectoSerializer,
    TipoEquipoConDetalleSerializer,
    TipoEquipoSerializer
)
from .models import EquipoProyecto


class TipoEquipoViewSet(viewsets.ModelViewSet):
    queryset = TipoEquipo.objects.select_related('creado_por').all()
    queryset_detalle = TipoEquipo.objects.select_related(
        'creado_por'
    ).prefetch_related(
        'documentos',
        'clases_tipo_equipo',
        'campos'
    ).all()
    serializer_class = TipoEquipoSerializer

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.using('read_only')
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        self.serializer_class = TipoEquipoConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        self.serializer_class = TipoEquipoConDetalleSerializer
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        self.serializer_class = TipoEquipoConDetalleSerializer
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def listar_para_crear_equipos(self, request):
        self.queryset = self.queryset_detalle.filter(activo=True).using('read_only')
        self.serializer_class = TipoEquipoConDetalleSerializer
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upload_archivo(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        nombre_archivo = self.request.POST.get('nombre')
        archivo = self.request.FILES['archivo']
        from .services import tipo_equipo_upload_documento
        tipo_equipo_upload_documento(
            nombre_archivo=nombre_archivo,
            archivo=archivo,
            creado_por_id=self.request.user.id,
            tipo_equipo_id=pk
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def delete_archivo(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        archivo_id = self.request.POST.get('archivo_id')
        from .services import tipo_equipo_delete_documento
        tipo_equipo_delete_documento(
            archivo_id=archivo_id,
            tipo_equipo_id=pk
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def editar_archivo(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        nombre_archivo = self.request.POST.get('nombre')
        archivo_id = self.request.POST.get('archivo_id')
        from .services import tipo_equipo_update_documento
        tipo_equipo_update_documento(
            tipo_equipo_id=pk,
            archivo_id=archivo_id,
            nombre_archivo=nombre_archivo
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_clase(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        tipo_equipo_clase_id = self.request.POST.get('tipo_equipo_clase_id')
        from .services import tipo_equipo_clase_eliminar
        tipo_equipo_clase_eliminar(
            tipo_equipo_id=pk,
            tipo_equipo_clase_id=tipo_equipo_clase_id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def crear_clase(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        sigla = self.request.POST.get('sigla')
        nombre = self.request.POST.get('nombre')
        from .services import tipo_equipo_clase_crear
        tipo_equipo_clase_crear(
            tipo_equipo_id=pk,
            sigla=sigla,
            nombre=nombre
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def actualizar_clase(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        sigla = self.request.POST.get('sigla')
        tipo_equipo_clase_id = self.request.POST.get('tipo_equipo_clase_id')
        nombre = self.request.POST.get('nombre')
        activo = self.request.POST.get('activo') == 'true'
        from .services import tipo_equipo_clase_update
        tipo_equipo_clase_update(
            tipo_equipo_id=pk,
            sigla=sigla,
            tipo_equipo_clase_id=tipo_equipo_clase_id,
            nombre=nombre,
            activo=activo
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def crear_campo(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        label = self.request.POST.get('label')
        tamano = self.request.POST.get('tamano')
        tamano_columna = self.request.POST.get('tamano_columna')
        unidad_medida = self.request.POST.get('unidad_medida')
        tipo = self.request.POST.get('tipo')
        opciones_list = self.request.POST.get('opciones_list')
        orden = self.request.POST.get('orden')
        from .services import tipo_equipo_campo_crear
        tipo_equipo_campo_crear(
            tipo_equipo_id=pk,
            label=label,
            tamano=tamano,
            tamano_columna=tamano_columna,
            unidad_medida=unidad_medida,
            tipo=tipo,
            opciones_list=opciones_list,
            orden=orden
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def actualizar_campo(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        label = self.request.POST.get('label')
        tamano = self.request.POST.get('tamano')
        tamano_columna = self.request.POST.get('tamano_columna')
        unidad_medida = self.request.POST.get('unidad_medida')
        tipo = self.request.POST.get('tipo')
        tipo_equipo_campo_id = self.request.POST.get('tipo_equipo_campo_id')
        opciones_list = self.request.POST.get('opciones_list')
        orden = self.request.POST.get('orden')
        from .services import tipo_equipo_campo_actualizar
        tipo_equipo_campo_actualizar(
            tipo_equipo_campo_id=tipo_equipo_campo_id,
            tipo_equipo_id=pk,
            label=label,
            tamano=tamano,
            tamano_columna=tamano_columna,
            unidad_medida=unidad_medida,
            tipo=tipo,
            opciones_list=opciones_list,
            orden=orden
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_campo(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        tipo_equipo_campo_id = self.request.POST.get('tipo_equipo_campo_id')
        from .services import tipo_equipo_campo_eliminar
        tipo_equipo_campo_eliminar(
            tipo_equipo_id=pk,
            tipo_equipo_campo_id=tipo_equipo_campo_id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)


class EquipoProyectoViewSet(viewsets.ModelViewSet):
    queryset = EquipoProyecto.objects.select_related('creado_por').all()
    queryset_detalle = EquipoProyecto.objects.select_related(
        'creado_por',
        'tipo_equipo_clase'
    ).prefetch_related(
        'documentos').all()
    serializer_class = EquipoProyectoSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle.using('read_only')
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        self.serializer_class = EquipoProyectoConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        self.serializer_class = EquipoProyectoConDetalleSerializer
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def listar_por_literal(self, request):
        literal_id = self.request.GET.get('literal_id')
        self.queryset = self.queryset.filter(literal_id=literal_id).using('read_only')
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)
