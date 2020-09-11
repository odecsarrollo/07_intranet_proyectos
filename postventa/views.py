from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import PostventaEventoEquipo
from .serializers import (
    PostventaEventoEquipoSerializer,
    PostventaEventoEquipoConDetalleSerializer
)


class PostventaEventoEquipoViewSet(viewsets.ModelViewSet):
    queryset = PostventaEventoEquipo.objects.select_related(
        'equipo',
        'equipo__literal__proyecto__cliente'
    ).all()
    serializer_class = PostventaEventoEquipoSerializer

    @action(detail=True, methods=['post'])
    def upload_documento(self, request, pk=None):
        self.serializer_class = PostventaEventoEquipoConDetalleSerializer
        nombre_archivo = self.request.POST.get('nombre')
        archivo = self.request.FILES['archivo']
        from .services import upload_postventa_evento_equipo_proyecto_documento
        upload_postventa_evento_equipo_proyecto_documento(
            nombre_archivo=nombre_archivo,
            archivo=archivo,
            creado_por_id=self.request.user.id,
            equipo_id=pk
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upload_imagen(self, request, pk=None):
        self.serializer_class = PostventaEventoEquipoConDetalleSerializer
        nombre_archivo = self.request.POST.get('nombre')
        imagen = self.request.FILES['imagen']
        from .services import upload_postventa_evento_equipo_proyecto_imagen
        upload_postventa_evento_equipo_proyecto_imagen(
            nombre_archivo=nombre_archivo,
            imagen=imagen,
            creado_por_id=self.request.user.id,
            equipo_id=pk
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def delete_archivo(self, request, pk=None):
        self.serializer_class = PostventaEventoEquipoConDetalleSerializer
        documento_id = self.request.POST.get('archivo_id')
        from .services import delete_postventa_evento_equipo_proyecto_documento
        delete_postventa_evento_equipo_proyecto_documento(
            documento_id=documento_id,
            equipo_id=pk
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def editar_archivo(self, request, pk=None):
        self.serializer_class = PostventaEventoEquipoConDetalleSerializer
        nombre_archivo = self.request.POST.get('nombre')
        archivo_id = self.request.POST.get('archivo_id')
        from .services import update_postventa_evento_equipo_proyecto_documento
        update_postventa_evento_equipo_proyecto_documento(
            equipo_id=pk,
            nombre_archivo=nombre_archivo,
            archivo_id=archivo_id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)
