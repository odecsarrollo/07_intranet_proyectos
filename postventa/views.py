from rest_framework import viewsets
from .models import PostventaEventoEquipo
from .serializers import PostventaEventoEquipoSerializer


class PostventaEventoEquipoViewSet(viewsets.ModelViewSet):
    queryset = PostventaEventoEquipo.objects.all()
    serializer_class = PostventaEventoEquipoSerializer
