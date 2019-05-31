from django.core.exceptions import ValidationError
from rest_framework import viewsets

from .models import (
    ProformaConfiguracion,
    ProformaAnticipoItem,
    ProformaAnticipo
)

from .api_serializers import (
    ProformaAnticipoItemSerializer,
    ProformaAnticipoSerializer,
    ProformaConfiguracionSerializer
)


class ProformaConfiguracionViewSet(viewsets.ModelViewSet):
    queryset = ProformaConfiguracion.objects.all()
    serializer_class = ProformaConfiguracionSerializer

    def list(self, request, *args, **kwargs):
        proforma = ProformaConfiguracion.objects.first()
        if not proforma:
            ProformaConfiguracion.objects.create()
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo crear no disponible'})

    def destroy(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo eliminar no disponible'})


class ProformaAnticipoItemViewSet(viewsets.ModelViewSet):
    queryset = ProformaAnticipoItem.objects.all()
    serializer_class = ProformaAnticipoItemSerializer


class ProformaAnticipoViewSet(viewsets.ModelViewSet):
    queryset = ProformaAnticipo.objects.all()
    serializer_class = ProformaAnticipoSerializer
