from rest_framework import viewsets
from rest_framework.decorators import action
from .models import (
    EquipoComputador,
    EquipoCelular,
    EquipoCelularFoto,
    EquipoComputadorFoto
)

from .api_serializers import (
    EquipoComputadorSerializer,
    EquipoCelularSerializer,
    EquipoComputadorFotoSerializer,
    EquipoCelularFotoSerializer,

)


class EquipoComputadorViewSet(viewsets.ModelViewSet):
    queryset = EquipoComputador.objects.all()
    serializer_class = EquipoComputadorSerializer

    @action(detail=False, http_method_names=['post', ])
    def subir_archivo(self, request):
        print(request)
        # return Response(serializer.data)
        return None


class EquipoCelularViewSet(viewsets.ModelViewSet):
    queryset = EquipoCelular.objects.all()
    serializer_class = EquipoCelularSerializer


class EquipoComputadorFotoViewSet(viewsets.ModelViewSet):
    queryset = EquipoComputadorFoto.objects.all()
    serializer_class = EquipoComputadorFotoSerializer


class EquipoCelularFotoViewSet(viewsets.ModelViewSet):
    queryset = EquipoCelularFoto.objects.all()
    serializer_class = EquipoCelularFotoSerializer
