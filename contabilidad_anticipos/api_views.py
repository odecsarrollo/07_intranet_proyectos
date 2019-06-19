from django.core.exceptions import ValidationError
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    ProformaConfiguracion,
    ProformaAnticipoItem,
    ProformaAnticipo
)

from .api_serializers import (
    ProformaAnticipoItemSerializer,
    ProformaAnticipoSerializer,
    ProformaAnticipoConDetalleSerializer,
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

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.queryset.prefetch_related('items')
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def adicionar_item(self, request, pk=None):
        from .services import proforma_anticipo_item_adicionar
        cantidad = self.request.POST.get('cantidad')
        descripcion = self.request.POST.get('descripcion')
        valor_unitario = self.request.POST.get('valor_unitario')
        proforma_anticipo = proforma_anticipo_item_adicionar(
            cantidad=cantidad,
            descripcion=descripcion,
            valor_unitario=valor_unitario,
            proforma_anticipo_id=self.get_object().id
        )
        self.queryset = self.queryset.prefetch_related('items')
        serializer = self.get_serializer(proforma_anticipo)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_item(self, request, pk=None):
        item_id = self.request.POST.get('item_id')
        proforma = self.get_object()
        proforma.items.remove(item_id)
        self.queryset = self.queryset.prefetch_related('items')
        serializer = self.get_serializer(proforma)
        return Response(serializer.data)

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
