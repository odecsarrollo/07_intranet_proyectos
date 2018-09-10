from rest_framework import viewsets

from .models import Fase, FaseLiteral, TareaFase
from .api_serializers import FaseLiteralSerializer, FaseSerializer, TareaFaseSerializer


class FaseViewSet(viewsets.ModelViewSet):
    queryset = Fase.objects.all()
    serializer_class = FaseSerializer


class TareaFaseViewSet(viewsets.ModelViewSet):
    queryset = TareaFase.objects.all()
    serializer_class = TareaFaseSerializer


class FaseLiteralViewSet(viewsets.ModelViewSet):
    queryset = FaseLiteral.objects.all()
    serializer_class = FaseLiteralSerializer
