from rest_framework import viewsets, serializers, status

from .models import ColaboradorBiable
from .api_serializers import ColaboradorBiableSerializer


class ColaboradorBiableViewSet(viewsets.ModelViewSet):
    queryset = ColaboradorBiable.objects.all()
    serializer_class = ColaboradorBiableSerializer
