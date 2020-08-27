from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import CorreoAplicacion
from .serializers import CorreoAplicacionSerializer


class CorreoAplicacionViewSet(viewsets.ModelViewSet):
    queryset = CorreoAplicacion.objects.all()
    serializer_class = CorreoAplicacionSerializer

    @action(detail=False, methods=['get'])
    def por_aplicacion(self, request):
        aplicacion = self.request.GET.get('aplicacion')
        qs = self.queryset.using('read_only').filter(aplicacion=aplicacion).distinct()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
