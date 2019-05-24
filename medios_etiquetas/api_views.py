from rest_framework import viewsets, serializers

from .models import (
    Etiqueta
)

from .api_serializers import (
    EtiquetaSerializer
)


class EtiquetaViewSet(viewsets.ModelViewSet):
    queryset = Etiqueta.objects.all()
    serializer_class = EtiquetaSerializer

    #def create(self, validated_data):
        #content = {'_error': ['No se puede eliminar, ya se encuentra verificado']}
        #raise serializers.ValidationError(content)
