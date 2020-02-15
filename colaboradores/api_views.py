from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Colaborador
from .api_serializers import ColaboradorSerializer


class ColaboradorViewSet(viewsets.ModelViewSet):
    queryset = Colaborador.objects.all()
    serializer_class = ColaboradorSerializer