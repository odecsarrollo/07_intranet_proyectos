from rest_framework import viewsets


from .models import(
    Etiqueta
)

from .api_serializers import(
    EtiquetaSerializer
)

class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer