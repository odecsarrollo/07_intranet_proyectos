from rest_framework import viewsets
from .models import (
    CiudadCatalogo
)
from .api_serializers import (
    CiudadCatalogoSerializer
)


class CiudadCatalogoViewSet(viewsets.ModelViewSet):
    queryset = CiudadCatalogo.objects.select_related(
        'ciudad_intranet',
        'departamento',
        'departamento__pais',
        'sistema_informacion'
    ).all()
    serializer_class = CiudadCatalogoSerializer
