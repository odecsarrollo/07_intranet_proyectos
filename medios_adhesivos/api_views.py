from django.db.models import Sum, OuterRef, ExpressionWrapper, Subquery, IntegerField
from django.db.models.functions import Coalesce
from rest_framework import viewsets
from rest_framework.decorators import action
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
    # consulta los adhesivos en tiempo real
    queryset = Adhesivo.objects.all()
    # instancia del serializador
    serializer_class = AdhesivoSerializer

    # metodo que sobre escribe el queryset
    def get_queryset(self):
        # consulta cual es el ultimo movimiento de los adhesivos
        disponible = AdhesivoMovimiento.objects.values('adhesivo_id').filter(
            adhesivo_id=OuterRef('id'),
            ultimo=True
        ).annotate(
            saldo=Coalesce(Sum('saldo'), 0)
        )
        # crea una funcion que modifica un valor del modelo antes de enviarlo al fontend
        qs = self.queryset.annotate(
            disponible=Coalesce(
                ExpressionWrapper(
                    Subquery(disponible.values('saldo')),
                    # especifica el tipo de campo que se va a adjuntar
                    output_field=IntegerField()
                ), 0
            )
        )
        # [print(x.__dict__) for x in qs.all()]

        return qs

    @action(detail=False, http_method_names=['get', ])
    def listar_adhesivos_x_tipo(self, request):
        tipo = request.GET.get('tipo')
        qs = self.get_queryset().filter(tipo=tipo)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class AdhesivoMovimientoViewSet(viewsets.ModelViewSet):
    queryset = AdhesivoMovimiento.objects.select_related('adhesivo').all()
    serializer_class = MovimientoAdhesivoSerializer
