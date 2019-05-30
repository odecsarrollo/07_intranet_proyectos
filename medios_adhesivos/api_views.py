from rest_framework import viewsets, serializers, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import (
    Adhesivo,
    AdhesivoMovimiento
)

from .api_serializers import (
    AdhesivoSerializer,
    MovimientoAdhesivoSerializer
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
        # content = {'_error': ['No se puede eliminar, ya se encuentra verificado']}
        # raise serializers.ValidationError(content)


class AdhesivoMovimientoViewSet(viewsets.ModelViewSet):
    queryset = AdhesivoMovimiento.objects.all()
    serializer_class = MovimientoAdhesivoSerializer

    def create(self, validated_data):
        
        obj_new = validated_data.data
        obj_old = self.queryset.filter(
            ultimo=True, adhesivo=obj_new['adhesivo']).first()

        aux = False

        content_error = {'_error': [
            'La cantidad que va a salir es mayor a la existente']}

        if not obj_old:
            if obj_new['tipo'] == 'E':
                obj_new['saldo'] = obj_new['cantidad']
                aux = True
            else:
                raise serializers.ValidationError(content_error)
        elif obj_new['tipo'] == 'E':
            obj_new['saldo'] = obj_old.saldo + int(obj_new['cantidad'])
        else:
            obj_new['saldo'] = obj_old.saldo - int(obj_new['cantidad'])
            if obj_new['saldo'] < 0:
                raise serializers.ValidationError(content_error)
        obj_new['ultimo'] = True
        serializer = self.serializer_class(data=obj_new)
        if serializer.is_valid():
            question = serializer.save()
            if aux == False:
                obj_old.ultimo = False
                obj_old.save()
            return Response(self.serializer_class(question).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
