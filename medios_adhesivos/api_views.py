from rest_framework import viewsets, serializers
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import (
    Adhesivo
)

from .api_serializers import (
    AdhesivoSerializer
)


class AdhesivoViewSet(viewsets.ModelViewSet):
    queryset = Adhesivo.objects.all()
    serializer_class = AdhesivoSerializer

    @list_route(http_method_names=['get', ])
    def listar_adhesivos_x_tipo(self, request):
        tipo = request.GET.get('tipo')
        qs = self.queryset.filter(tipo=tipo)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    # def create(self, validated_data):
        #content = {'_error': ['No se puede eliminar, ya se encuentra verificado']}
        #raise serializers.ValidationError(content)
