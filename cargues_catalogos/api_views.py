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
    queryset = SeguimientoCargue.objects.prefetch_related('procedimientos').order_by('-fecha').all()[:60]
    serializer_class = SeguimientoCargueSerializer

    def list(self, request, *args, **kwargs):
        ids_a_mantener = list(SeguimientoCargue.objects.values_list('id', flat=True).order_by('-id').all()[:100])
        qs_a_borrar = SeguimientoCargue.objects.exclude(id__in=ids_a_mantener)
        for seguimiento in qs_a_borrar.all():
            for procedimiento in seguimiento.procedimientos.all():
                procedimiento.delete()
        return super().list(request, *args, **kwargs)


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
