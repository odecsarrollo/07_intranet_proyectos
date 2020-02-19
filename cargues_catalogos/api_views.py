from rest_framework import viewsets
from .models import (
    CiudadCatalogo,
    SeguimientoCargueProcedimiento,
    SeguimientoCargue
)
from .api_serializers import (
    CiudadCatalogoSerializer,
    SeguimientoCargueSerializer,
    SeguimientoCargueProcedimientoSerializer
)


class SeguimientoCargueViewSet(viewsets.ModelViewSet):
    queryset = SeguimientoCargue.objects.prefetch_related('procedimientos').order_by('-fecha').all()[:30]
    serializer_class = SeguimientoCargueSerializer


class SeguimientoCargueProcedimientoViewSet(viewsets.ModelViewSet):
    queryset = SeguimientoCargueProcedimiento.objects.all()
    serializer_class = SeguimientoCargueProcedimientoSerializer


class CiudadCatalogoViewSet(viewsets.ModelViewSet):
    queryset = CiudadCatalogo.objects.select_related(
        'ciudad_intranet',
        'departamento',
        'departamento__pais',
        'sistema_informacion'
    ).all()
    serializer_class = CiudadCatalogoSerializer
