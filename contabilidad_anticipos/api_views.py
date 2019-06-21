from io import BytesIO

from PyPDF2 import PdfFileReader
from django.core.exceptions import ValidationError
from django.http import HttpResponse
from rest_framework import viewsets, status
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
    queryset = ProformaAnticipo.objects.prefetch_related('items').all()
    serializer_class = ProformaAnticipoSerializer

    def destroy(self, request, *args, **kwargs):
        proforma = self.get_object()
        from .services import proforma_anticipo_eliminar
        proforma_anticipo_eliminar(proforma.id)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def retrieve(self, request, *args, **kwargs):
        self.queryset = self.queryset.prefetch_related('items')
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        return super().update(request, *args, **kwargs)

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
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        serializer = self.get_serializer(proforma_anticipo)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        from .services import proforma_anticipo_cambiar_estado
        estado = self.request.POST.get('estado')
        proforma_anticipo = proforma_anticipo_cambiar_estado(
            estado=estado,
            proforma_anticipo_id=self.get_object().id
        )
        self.queryset = self.queryset.prefetch_related('items')
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        serializer = self.get_serializer(proforma_anticipo)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_item(self, request, pk=None):
        item_id = self.request.POST.get('item_id')
        proforma = self.get_object()
        from .services import proforma_anticipo_item_eliminar
        proforma_anticipo_item_eliminar(
            proforma_anticipo_id=proforma.id,
            proforma_anticipo_item_id=item_id
        )
        proforma = self.get_object()
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        serializer = self.get_serializer(proforma)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def imprimir_cobro(self, request, pk=None):
        from .services import proforma_cobro_generar_pdf
        anticipo = self.get_object()
        response = HttpResponse(content_type='application/pdf')
        if anticipo.editable:
            output = proforma_cobro_generar_pdf(
                id=anticipo.id,
                request=request
            )
            response.write(output.getvalue())
            output.close()
        else:
            response.write(anticipo.documento.archivo.read())
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        return response

    @action(detail=True, methods=['post'])
    def enviar_cobro(self, request, pk=None):
        from .services import proforma_anticipo_enviar
        proforma = self.get_object()
        proforma = proforma_anticipo_enviar(
            proforma_anticipo_id=proforma.id,
            request=request
        )
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        serializer = self.get_serializer(proforma)
        return Response(serializer.data)
