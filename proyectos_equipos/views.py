from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import TipoEquipo
from .models import TipoEquipoClase
from .serializers import EquipoProyectoBusquedaRapidaSerializer
from .serializers import (
    EquipoProyectoConDetalleSerializer,
    EquipoProyectoSerializer,
    TipoEquipoConDetalleSerializer,
    TipoEquipoSerializer,
    TipoEquipoClaseSerializer,
)
from .models import EquipoProyecto
from .serializers import TipoEquipoClaseConDetalleSerializer


class TipoEquipoClaseViewSet(viewsets.ModelViewSet):
    queryset = TipoEquipoClase.objects.all()
    serializer_class = TipoEquipoClaseSerializer
    queryset_detalle = TipoEquipoClase.objects.select_related(
        'tipo_equipo'
    ).prefetch_related(
        'campos',
        'documentos',
    ).all()

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle.using('read_only')
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def crear_campo(self, request, pk=None):
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        label = self.request.POST.get('label')
        tamano = self.request.POST.get('tamano')
        tamano_columna = self.request.POST.get('tamano_columna')
        unidad_medida = self.request.POST.get('unidad_medida')
        obligatorio = self.request.POST.get('obligatorio') == 'true'
        tipo = self.request.POST.get('tipo')
        opciones_list = self.request.POST.get('opciones_list')
        orden = self.request.POST.get('orden')
        from .services import campo_crear
        campo_crear(
            tipo_equipo_clase_id=pk,
            label=label,
            tamano=tamano,
            tamano_columna=tamano_columna,
            unidad_medida=unidad_medida,
            tipo=tipo,
            opciones_list=opciones_list,
            orden=orden,
            obligatorio=obligatorio
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def actualizar_campo(self, request, pk=None):
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        label = self.request.POST.get('label')
        tamano = self.request.POST.get('tamano')
        tamano_columna = self.request.POST.get('tamano_columna')
        unidad_medida = self.request.POST.get('unidad_medida')
        tipo = self.request.POST.get('tipo')
        tipo_equipo_campo_id = self.request.POST.get('tipo_equipo_campo_id')
        opciones_list = self.request.POST.get('opciones_list')
        orden = self.request.POST.get('orden')
        obligatorio = self.request.POST.get('obligatorio') == 'true'
        from .services import campo_actualizar
        campo_actualizar(
            tipo_equipo_campo_id=tipo_equipo_campo_id,
            tipo_equipo_clase_id=pk,
            label=label,
            tamano=tamano,
            tamano_columna=tamano_columna,
            unidad_medida=unidad_medida,
            tipo=tipo,
            opciones_list=opciones_list,
            orden=orden,
            obligatorio=obligatorio
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_campo(self, request, pk=None):
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        tipo_equipo_campo_id = self.request.POST.get('tipo_equipo_campo_id')
        from .services import campo_eliminar
        campo_eliminar(
            tipo_equipo_clase_id=pk,
            tipo_equipo_campo_id=tipo_equipo_campo_id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upload_archivo(self, request, pk=None):
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        nombre_archivo = self.request.POST.get('nombre')
        archivo = self.request.FILES['archivo']
        from .services import upload_documento
        upload_documento(
            nombre_archivo=nombre_archivo,
            archivo=archivo,
            creado_por_id=self.request.user.id,
            tipo_equipo_clase_id=pk
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def delete_archivo(self, request, pk=None):
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        archivo_id = self.request.POST.get('archivo_id')
        from .services import delete_documento
        delete_documento(
            archivo_id=archivo_id,
            tipo_equipo_clase_id=pk
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def editar_archivo(self, request, pk=None):
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        nombre_archivo = self.request.POST.get('nombre')
        archivo_id = self.request.POST.get('archivo_id')
        from .services import update_documento
        update_documento(
            tipo_equipo_clase_id=pk,
            archivo_id=archivo_id,
            nombre_archivo=nombre_archivo
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def crear_rutina(self, request, pk=None):
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        mes = self.request.POST.get('mes')
        descripcion = self.request.POST.get('descripcion')
        from .services import rutina_crear
        rutina_crear(
            tipo_equipo_clase_id=pk,
            descripcion=descripcion,
            mes=mes
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def actualizar_rutina(self, request, pk=None):
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        rutina_id = self.request.POST.get('rutina_id')
        mes = self.request.POST.get('mes')
        descripcion = self.request.POST.get('descripcion')
        from .services import rutina_actualizar
        rutina_actualizar(
            rutina_id=rutina_id,
            tipo_equipo_clase_id=pk,
            descripcion=descripcion,
            mes=mes
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_rutina(self, request, pk=None):
        self.serializer_class = TipoEquipoClaseConDetalleSerializer
        rutina_id = self.request.POST.get('rutina_id')
        from .services import rutina_eliminar
        rutina_eliminar(
            tipo_equipo_clase_id=pk,
            rutina_id=rutina_id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)


class TipoEquipoViewSet(viewsets.ModelViewSet):
    queryset = TipoEquipo.objects.select_related('creado_por').all()
    queryset_detalle = TipoEquipo.objects.select_related(
        'creado_por'
    ).prefetch_related(
        'documentos',
        'clases_tipo_equipo',
        'clases_tipo_equipo__campos',
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
        from .services import upload_documento
        upload_documento(
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
        from .services import delete_documento
        delete_documento(
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
        from .services import update_documento
        update_documento(
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
        obligatorio = self.request.POST.get('obligatorio') == 'true'
        tipo = self.request.POST.get('tipo')
        opciones_list = self.request.POST.get('opciones_list')
        orden = self.request.POST.get('orden')
        from .services import campo_crear
        campo_crear(
            tipo_equipo_id=pk,
            label=label,
            tamano=tamano,
            tamano_columna=tamano_columna,
            unidad_medida=unidad_medida,
            tipo=tipo,
            opciones_list=opciones_list,
            orden=orden,
            obligatorio=obligatorio
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
        obligatorio = self.request.POST.get('obligatorio') == 'true'
        from .services import campo_actualizar
        campo_actualizar(
            tipo_equipo_campo_id=tipo_equipo_campo_id,
            tipo_equipo_id=pk,
            label=label,
            tamano=tamano,
            tamano_columna=tamano_columna,
            unidad_medida=unidad_medida,
            tipo=tipo,
            opciones_list=opciones_list,
            orden=orden,
            obligatorio=obligatorio
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_campo(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        tipo_equipo_campo_id = self.request.POST.get('tipo_equipo_campo_id')
        from .services import campo_eliminar
        campo_eliminar(
            tipo_equipo_id=pk,
            tipo_equipo_campo_id=tipo_equipo_campo_id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def crear_rutina(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        mes = self.request.POST.get('mes')
        descripcion = self.request.POST.get('descripcion')
        from .services import rutina_crear
        rutina_crear(
            tipo_equipo_id=pk,
            descripcion=descripcion,
            mes=mes
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def actualizar_rutina(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        rutina_id = self.request.POST.get('rutina_id')
        mes = self.request.POST.get('mes')
        descripcion = self.request.POST.get('descripcion')
        from .services import rutina_actualizar
        rutina_actualizar(
            rutina_id=rutina_id,
            tipo_equipo_id=pk,
            descripcion=descripcion,
            mes=mes
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_rutina(self, request, pk=None):
        self.serializer_class = TipoEquipoConDetalleSerializer
        rutina_id = self.request.POST.get('rutina_id')
        from .services import rutina_eliminar
        rutina_eliminar(
            tipo_equipo_id=pk,
            rutina_id=rutina_id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)


class EquipoProyectoViewSet(viewsets.ModelViewSet):
    queryset = EquipoProyecto.objects.select_related('creado_por').all()
    queryset_detalle = EquipoProyecto.objects.select_related(
        'creado_por',
        'tipo_equipo_clase'
    ).all()
    serializer_class = EquipoProyectoSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle.using('read_only')
        return super().list(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        from .services import equipo_eliminar
        equipo_eliminar(
            equipo_id=instance.id
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        self.serializer_class = EquipoProyectoConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        nombre = request.data.get('nombre')
        literal = request.data.get('literal')
        tipo_equipo_clase = request.data.get('tipo_equipo_clase')
        adicionales = {}
        campos = request.data
        for campo in campos:
            if campo[0:7] == 'campoTP':
                adicionales[int(campo[8:])] = campos[campo]
        from .services import equipo_proyecto_create
        equipo = equipo_proyecto_create(
            nombre=nombre,
            literal_id=literal,
            tipo_equipo_clase_id=tipo_equipo_clase,
            creado_por_id=self.request.user.id,
            campos_adicionales=adicionales
        )
        serializer = self.get_serializer(equipo)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        self.serializer_class = EquipoProyectoConDetalleSerializer
        return super().update(request, *args, **kwargs)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_identificador(self, request):
        identificador = request.GET.get('identificador')
        self.serializer_class = EquipoProyectoBusquedaRapidaSerializer
        qs = EquipoProyecto.objects.filter(identificador__icontains=identificador).using('read_only')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def listar_por_literal(self, request):
        literal_id = self.request.GET.get('literal_id')
        self.queryset = self.queryset.filter(literal_id=literal_id).using('read_only')
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def crear_garantia(self, request, pk=None):
        self.serializer_class = EquipoProyectoConDetalleSerializer
        descripcion = self.request.POST.get('descripcion')
        fecha_final = self.request.POST.get('fecha_final')
        fecha_inicial = self.request.POST.get('fecha_inicial')
        from postventa.services import garantia_crear
        garantia_crear(
            equipo_id=pk,
            descripcion=descripcion,
            fecha_final=fecha_final,
            fecha_inicial=fecha_inicial,
            user_id=self.request.user.id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def actualizar_garantia(self, request, pk=None):
        self.serializer_class = EquipoProyectoConDetalleSerializer
        descripcion = self.request.POST.get('descripcion')
        fecha_final = self.request.POST.get('fecha_final')
        fecha_inicial = self.request.POST.get('fecha_inicial')
        garantia_id = self.request.POST.get('garantia_id')
        from postventa.services import garantia_actualizar
        garantia_actualizar(
            equipo_id=pk,
            garantia_id=garantia_id,
            descripcion=descripcion,
            fecha_final=fecha_final,
            fecha_inicial=fecha_inicial
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_garantia(self, request, pk=None):
        self.serializer_class = EquipoProyectoConDetalleSerializer
        garantia_id = self.request.POST.get('garantia_id')
        from postventa.services import garantia_eliminar
        garantia_eliminar(
            equipo_id=pk,
            garantia_id=garantia_id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)
