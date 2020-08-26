from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Ciudad,
    Departamento,
    Pais
)
from .api_serializers import (
    PaisSerializer,
    DepartamentoSerializer,
    CiudadSerializer
)


class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.using('read_only')
        return super().list(request, *args, **kwargs)


class DepartamentoViewSet(viewsets.ModelViewSet):
    queryset = Departamento.objects.select_related('pais').all()
    serializer_class = DepartamentoSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.using('read_only')
        return super().list(request, *args, **kwargs)


class CiudadViewSet(viewsets.ModelViewSet):
    queryset = Ciudad.objects.select_related('departamento', 'departamento__pais').all()
    serializer_class = CiudadSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.using('read_only')
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post'])
    def crear_ciudad_desde_cotizacion(self, request, pk=None):
        from .services import ciudad_departamento_ciudad_crear_desde_cotizacion
        nuevo_pais = request.POST.get('nuevo_pais', False)
        nuevo_departamento = request.POST.get('nuevo_departamento', False)
        pais_id = request.POST.get('pais', None)
        departamento_id = request.POST.get('departamento', None)
        pais_nombre = request.POST.get('pais_nombre', None)
        departamento_nombre = request.POST.get('departamento_nombre', None)
        ciudad_nombre = request.POST.get('ciudad_nombre', None)
        ciudad = ciudad_departamento_ciudad_crear_desde_cotizacion(
            nuevo_pais,
            nuevo_departamento,
            pais_id=pais_id,
            departamento_id=departamento_id,
            pais_nombre=pais_nombre,
            departamento_nombre=departamento_nombre,
            ciudad_nombre=ciudad_nombre
        )
        serializer = self.get_serializer(ciudad)
        return Response(serializer.data)
