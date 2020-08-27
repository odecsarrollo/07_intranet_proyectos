from rest_framework import viewsets
from .models import (
    SistemaInformacionOrigen
)
from .serializers import (
    SistemaInformacionOrigenSerializer
)


class SistemasInformacionOrigenViewSet(viewsets.ModelViewSet):
    queryset = SistemaInformacionOrigen.objects.all()
    serializer_class = SistemaInformacionOrigenSerializer
