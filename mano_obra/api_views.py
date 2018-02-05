from rest_framework import viewsets, serializers, status

from .models import TasaHora
from .api_serializers import TasaHoraSerializer


class TasaHoraViewSet(viewsets.ModelViewSet):
    queryset = TasaHora.objects.select_related('colaborador').order_by('colaborador', 'ano', 'mes').all()
    serializer_class = TasaHoraSerializer
