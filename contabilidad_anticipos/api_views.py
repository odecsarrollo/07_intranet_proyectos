from django.core.exceptions import ValidationError
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action

from .models import (
    ProformaConfiguracion,
    ProformaAnticipoItem,
    ProformaAnticipo
)

from .api_serializers import (
    ProformaAnticipoItemSerializer,
    ProformaAnticipoSerializer,
    ProformaConfiguracionSerializer
)


class ProformaConfiguracionViewSet(viewsets.ModelViewSet):
    queryset = ProformaConfiguracion.objects.all()
    serializer_class = ProformaConfiguracionSerializer

    def list(self, request, *args, **kwargs):
        proforma = ProformaConfiguracion.objects.first()
        if not proforma:
            ProformaConfiguracion.objects.create()
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo crear no disponible'})

    def destroy(self, request, *args, **kwargs):
        raise ValidationError({'_error': 'Metodo eliminar no disponible'})


class ProformaAnticipoItemViewSet(viewsets.ModelViewSet):
    queryset = ProformaAnticipoItem.objects.all()
    serializer_class = ProformaAnticipoItemSerializer


class ProformaAnticipoViewSet(viewsets.ModelViewSet):
    queryset = ProformaAnticipo.objects.all()
    serializer_class = ProformaAnticipoSerializer

    @action(detail=True, methods=['post'])
    def imprimir_cobro(self, request, pk=None):
        from .services import proforma_cobro_generar_pdf
        anticipo = self.get_object()
        output = proforma_cobro_generar_pdf(
            id=anticipo.id,
            request=self.request
        )
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        response.write(output.getvalue())
        output.close()
        return response
