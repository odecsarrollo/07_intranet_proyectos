from rest_framework import viewsets
from .models import (
    FormaPagoCanal
)
from .api_serializers import (
    FormaPagoCanalSerializer
)


class FormaPagoCanalViewSet(viewsets.ModelViewSet):
    queryset = FormaPagoCanal.objects.select_related('canal').all()
    serializer_class = FormaPagoCanalSerializer
