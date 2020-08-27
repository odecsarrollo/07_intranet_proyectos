from rest_framework import viewsets

from .models import ConfiguracionCosto
from .serializers import ConfiguracionCostoSerializer


class ConfiguracionCostoViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionCosto.objects.all()
    serializer_class = ConfiguracionCostoSerializer
