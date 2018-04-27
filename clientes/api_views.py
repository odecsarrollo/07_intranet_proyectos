from rest_framework import viewsets
from .models import ClienteBiable
from .api_serializers import ClienteSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = ClienteBiable.objects.all()
    serializer_class = ClienteSerializer
