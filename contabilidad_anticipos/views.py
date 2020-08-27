import datetime

from django.core.exceptions import ValidationError
from django.db.models import Q
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    ProformaConfiguracion,
    ProformaAnticipoItem,
    ProformaAnticipo,
    ProformaAnticipoArchivo
)

from .serializers import (
    ProformaAnticipoItemSerializer,
    ProformaAnticipoSerializer,
    ProformaAnticipoConDetalleSerializer,
    ProformaAnticipoArchivoSerializer,
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


class ProformaAnticipoArchivoViewSet(viewsets.ModelViewSet):
    queryset = ProformaAnticipoArchivo.objects.all()
    serializer_class = ProformaAnticipoArchivoSerializer


class ProformaAnticipoItemViewSet(viewsets.ModelViewSet):
    queryset = ProformaAnticipoItem.objects.all()
    serializer_class = ProformaAnticipoItemSerializer


class ProformaAnticipoViewSet(viewsets.ModelViewSet):
    queryset = ProformaAnticipo.objects.prefetch_related('items').all()
    queryset_con_detalles = ProformaAnticipo.objects.prefetch_related(
        'items',
        'literales',
        'envios',
        'envios__creado_por'
    ).all()
    serializer_class = ProformaAnticipoSerializer

    @action(detail=True, methods=['post'])
    def upload_archivo(self, request, pk=None):
        nombre_archivo = self.request.POST.get('nombre')
        cobro = self.get_object()
        archivo = self.request.FILES['archivo']
        archivo_cobro = ProformaAnticipoArchivo()
        archivo_cobro.archivo = archivo
        archivo_cobro.cobro = cobro
        archivo_cobro.nombre_archivo = nombre_archivo
        archivo_cobro.creado_por = self.request.user
        archivo_cobro.enviar_por_correo = False
        archivo_cobro.save()
        serializer = self.get_serializer(cobro)
        return Response(serializer.data)

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

    @action(detail=False, methods=['get'])
    def reporte(self, request):
        month = int(request.GET.get('month', timezone.datetime.now().month))
        year = int(request.GET.get('year', timezone.datetime.now().year))
        anticipos = ProformaAnticipo.objects.exclude(
            estado__in=['EDICION', 'CREADA']
        ).filter(
            (
                    Q(estado__exact='CERRADA') &
                    Q(fecha_cobro__month=month) &
                    Q(fecha_cobro__year=year)
            ) |
            ~Q(estado__exact='CERRADA')
        )
        serializer = self.get_serializer(anticipos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_item(self, request, pk=None):
        from .services import proforma_anticipo_item_adicionar
        referencia = self.request.POST.get('referencia')
        cantidad = self.request.POST.get('cantidad')
        descripcion = self.request.POST.get('descripcion')
        valor_unitario = self.request.POST.get('valor_unitario')
        proforma_anticipo = proforma_anticipo_item_adicionar(
            referencia=referencia,
            cantidad=cantidad,
            descripcion=descripcion,
            valor_unitario=valor_unitario,
            proforma_anticipo_id=self.get_object().id
        )
        self.queryset = self.queryset_con_detalles
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        serializer = self.get_serializer(proforma_anticipo)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        from .services import proforma_anticipo_cambiar_estado
        estado = self.request.POST.get('estado')
        fecha_cobro = self.request.POST.get('fecha_cobro', None)
        recibo_pago = self.request.POST.get('recibo_pago', None)
        proforma_anticipo = proforma_anticipo_cambiar_estado(
            recibo_pago=recibo_pago,
            estado=estado,
            proforma_anticipo_id=self.get_object().id,
            fecha_cobro=fecha_cobro
        )
        self.queryset = self.queryset_con_detalles
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
        self.queryset = self.queryset_con_detalles
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
    def relacionar_literal(self, request, pk=None):
        literal_id = int(self.request.POST.get('literal_id'))
        from .services import proforma_anticipo_relacionar_literal
        proforma = self.get_object()
        proforma = proforma_anticipo_relacionar_literal(
            proforma_anticipo_id=proforma.id,
            literal_id=literal_id
        )
        self.queryset = self.queryset_con_detalles
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        serializer = self.get_serializer(proforma)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def quitar_relacion_literal(self, request, pk=None):
        literal_id = int(self.request.POST.get('literal_id'))
        from .services import proforma_anticipo_quitar_relacion_literal
        proforma = self.get_object()
        proforma = proforma_anticipo_quitar_relacion_literal(
            proforma_anticipo_id=proforma.id,
            literal_id=literal_id
        )
        self.queryset = self.queryset_con_detalles
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        serializer = self.get_serializer(proforma)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def enviar_cobro(self, request, pk=None):
        from .services import proforma_anticipo_enviar
        email_texto_adicional = self.request.POST.get('email_texto_adicional')
        proforma = self.get_object()
        proforma = proforma_anticipo_enviar(
            proforma_anticipo_id=proforma.id,
            request=request,
            email_texto_adicional=email_texto_adicional
        )
        self.serializer_class = ProformaAnticipoConDetalleSerializer
        serializer = self.get_serializer(proforma)
        return Response(serializer.data)
