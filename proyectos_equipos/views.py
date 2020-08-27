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
    queryset_detalle = TipoEquipo.objects.select_related('creado_por').prefetch_related('documentos').all()
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


class EquipoProyectoViewSet(viewsets.ModelViewSet):
    queryset = EquipoProyecto.objects.select_related('creado_por').all()
    queryset_detalle = EquipoProyecto.objects.select_related('creado_por').prefetch_related('documentos').all()
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
        self.serializer_class = EquipoProyectoConDetalleSerializer
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.queryset = self.queryset_detalle
        self.serializer_class = EquipoProyectoConDetalleSerializer
        return super().update(request, *args, **kwargs)
