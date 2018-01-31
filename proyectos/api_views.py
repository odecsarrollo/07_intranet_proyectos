from rest_framework import viewsets, serializers, status

from .models import Proyecto
from .api_serializers import ProyectoSerializer


class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all()
    serializer_class = ProyectoSerializer
