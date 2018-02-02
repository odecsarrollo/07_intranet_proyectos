from rest_framework import viewsets, serializers, status

from .models import Proyecto, Literal
from .api_serializers import ProyectoSerializer, LiteralSerializer


class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.prefetch_related('mis_literales').all()
    serializer_class = ProyectoSerializer


class LiteralViewSet(viewsets.ModelViewSet):
    queryset = Literal.objects.all()
    serializer_class = LiteralSerializer
