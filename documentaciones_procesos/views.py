from rest_framework import viewsets

from .models import (
    DocumentacionArea,
    DocumentacionProceso
)
from .serializers import (
    DocumentacionAreaSerializer,
    DocumentacionProcesoSerializer
)


class DocumentacionAreaViewSet(viewsets.ModelViewSet):
    queryset = DocumentacionArea.objects.all()
    serializer_class = DocumentacionAreaSerializer


class DocumentacionProcesoViewSet(viewsets.ModelViewSet):
    queryset = DocumentacionProceso.objects.all()
    serializer_class = DocumentacionProcesoSerializer
