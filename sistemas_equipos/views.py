from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
import json
from .models import (
    EquipoComputador,
    EquipoCelular,
    EquipoCelularFoto,
    EquipoComputadorFoto
)

from .serializers import (
    EquipoComputadorSerializer,
    EquipoCelularSerializer,
    EquipoComputadorFotoSerializer,
    EquipoCelularFotoSerializer,
)

class EquipoComputadorViewSet(viewsets.ModelViewSet):
    queryset = EquipoComputador.objects.all()
    serializer_class = EquipoComputadorSerializer

    @action(detail=False, methods=['post', ])
    def subir_archivo(self, request):
        listado_computadores = json.loads(request.POST.get('listado'))
        listado_computadores.pop(0)
        from .services import computadores_crear
        for pc in listado_computadores:
            nombre = pc.pop('nombre')
            marca = int(pc.pop('marca'))
            estado = int(pc.pop('estado'))
            procesador = int(pc.pop('procesador'))
            referencia = pc.pop('referencia')
            serial = pc.get('serial', None)
            tipo = int(pc.pop('tipo'))
            descripcion = pc.get('descripcion', None)
            computadores_crear(
                nombre=nombre,
                marca=marca,
                estado=estado,
                procesador=procesador,
                referencia=referencia,
                serial=serial,
                tipo=tipo,
                descripcion=descripcion
            )
        computadores = self.queryset
        serializer = self.get_serializer(computadores, many=True)
        return Response(serializer.data)


class EquipoCelularViewSet(viewsets.ModelViewSet):
    queryset = EquipoCelular.objects.all()
    serializer_class = EquipoCelularSerializer


class EquipoComputadorFotoViewSet(viewsets.ModelViewSet):
    queryset = EquipoComputadorFoto.objects.all()
    serializer_class = EquipoComputadorFotoSerializer


class EquipoCelularFotoViewSet(viewsets.ModelViewSet):
    queryset = EquipoCelularFoto.objects.all()
    serializer_class = EquipoCelularFotoSerializer
