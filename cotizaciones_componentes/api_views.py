from django.db.models import Q
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import CotizacionComponente, ItemCotizacionComponente, CotizacionComponenteAdjunto
from .api_serializers import (
    CotizacionComponenteSerializer,
    ItemCotizacionComponenteSerializer,
    CotizacionComponenteConDetalleSerializer
)


class CotizacionComponenteViewSet(viewsets.ModelViewSet):
    queryset = CotizacionComponente.objects.all()
    serializer_class = CotizacionComponenteSerializer

    # def list(self, request, *args, **kwargs):
    #     user = self.request.user
    #     self.queryset = self.queryset.filter(
    #         (
    #                 (Q(responsable__isnull=True) & Q(creado_por=user)) |
    #                 (Q(responsable__isnull=False) & Q(responsable=user))
    #         )
    #     )
    #     return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        cotizacion = self.get_object()
        if cotizacion.estado == 'INI' and (cotizacion.nro_consecutivo is None):
            cotizacion.items.all().delete()
            return super().destroy(request, *args, **kwargs)
        raise ValidationError({'_error': 'Imposible eliminar cotización, ya ha sido enviada'})

    @action(detail=True, methods=['post'])
    def asignar_consecutivo(self, request, pk=None):
        from .services import cotizacion_componentes_asignar_nro_consecutivo
        cotizacion_componente = self.get_object()
        cotizacion_componente = cotizacion_componentes_asignar_nro_consecutivo(
            cotizacion_componente_id=cotizacion_componente.id)
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        from .services import cotizacion_componentes_cambiar_estado
        cotizacion_componente = self.get_object()
        nuevo_estado = request.POST.get('nuevo_estado', None)
        razon_rechazo = request.POST.get('razon_rechazo', None)
        cotizacion_componente = cotizacion_componentes_cambiar_estado(
            cotizacion_componente_id=cotizacion_componente.id,
            nuevo_estado=nuevo_estado,
            razon_rechazo=razon_rechazo,
            usuario=self.request.user
        )
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def enviar(self, request, pk=None):
        from .services import cotizacion_componentes_enviar
        cotizacion_componente = self.get_object()
        email_uno = request.POST.get('email_uno', None)
        email_dos = request.POST.get('email_dos', None)
        email_tres = request.POST.get('email_tres', None)
        email_cuatro = request.POST.get('email_cuatro', None)
        email_asesor = request.POST.get('email_asesor', None)

        emails_destino = []
        if email_uno:
            emails_destino.append(email_uno)
        if email_dos:
            emails_destino.append(email_dos)
        if email_tres:
            emails_destino.append(email_tres)
        if email_cuatro:
            emails_destino.append(email_cuatro)
        if email_asesor:
            emails_destino.append(email_asesor)

        cotizacion_componente = cotizacion_componentes_enviar(
            cotizacion_componente_id=cotizacion_componente.id,
            request=request,
            emails_destino=emails_destino
        )
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def imprimir(self, request, pk=None):
        from .services import cotizacion_componentes_generar_pdf
        cotizacion = self.get_object()
        response = HttpResponse(content_type='application/pdf')
        output = cotizacion_componentes_generar_pdf(
            cotizacion_id=cotizacion.id,
            request=request
        )
        response.write(output.getvalue())
        output.close()
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        return response

    @action(detail=True, methods=['post'])
    def adicionar_seguimiento(self, request, pk=None):
        cotizacion_componente = self.get_object()
        tipo_seguimiento = request.POST.get('tipo_seguimiento')
        descripcion = request.POST.get('descripcion')
        fecha = request.POST.get('fecha', None)
        # ['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601']
        from .services import cotizacion_componentes_add_seguimiento
        cotizacion_componentes_add_seguimiento(
            cotizacion_componente_id=cotizacion_componente.id,
            tipo_seguimiento=tipo_seguimiento,
            descripcion=descripcion,
            creado_por=self.request.user,
            fecha=fecha
        )
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_seguimiento(self, request, pk=None):
        cotizacion_componente = self.get_object()
        seguimiento_id = request.POST.get('seguimiento_id')
        from .services import cotizacion_componentes_delete_seguimiento
        cotizacion_componentes_delete_seguimiento(
            cotizacion_componente_id=cotizacion_componente.id,
            cotizacion_componente_seguimiento_id=seguimiento_id,
            eliminado_por=self.request.user
        )
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_item(self, request, pk=None):
        cotizacion = self.get_object()
        tipo_item = request.POST.get('tipo_item')
        precio_unitario = request.POST.get('precio_unitario')
        item_descripcion = request.POST.get('item_descripcion')
        item_referencia = request.POST.get('item_referencia')
        item_unidad_medida = request.POST.get('item_unidad_medida')
        id_item = request.POST.get('id_item', None)
        forma_pago_id = request.POST.get('forma_pago_id', None)
        tipo_transporte = request.POST.get('tipo_transporte', None)
        from .services import cotizacion_componentes_adicionar_item
        cotizacion_componente = cotizacion_componentes_adicionar_item(
            tipo_item=tipo_item,
            cotizacion_componente_id=cotizacion.id,
            precio_unitario=precio_unitario,
            id_item=id_item,
            item_descripcion=item_descripcion,
            item_referencia=item_referencia,
            item_unidad_medida=item_unidad_medida,
            forma_pago_id=forma_pago_id,
            tipo_transporte=tipo_transporte
        )
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_item(self, request, pk=None):
        cotizacion = self.get_object()
        id_item_cotizacion = request.POST.get('id_item_cotizacion')
        from .services import cotizacion_componentes_item_eliminar
        cotizacion_componentes_item_eliminar(
            item_componente_id=id_item_cotizacion
        )
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_posicion_item(self, request, pk=None):
        from .services import cotizacion_componentes_item_cambiar_posicion
        # print(request.META.get('HTTP_X_FORWARDED_FOR'))
        # print(request.META.get('REMOTE_ADDR'))
        cotizacion_componente = self.get_object()
        item_uno_id = request.POST.get('item_uno_id')
        item_dos_id = request.POST.get('item_dos_id')
        cotizacion_componentes_item_cambiar_posicion(
            cotizacion_componente_id=cotizacion_componente.id,
            item_uno_id=item_uno_id,
            item_dos_id=item_dos_id
        )
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_en_edicion_asesor(self, request):
        user = self.request.user
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        lista = self.queryset.filter(
            Q(estado='INI') &
            (
                    (Q(responsable__isnull=True) & Q(creado_por=user)) |
                    (Q(responsable__isnull=False) & Q(responsable=user))
            )
        ).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upload_archivo(self, request, pk=None):
        cotizacion_componente = self.get_object()
        nombre_archivo = self.request.POST.get('nombre')
        archivo = self.request.FILES['archivo']
        tipo = self.request.POST.get('tipo')
        adjunto_cotizacion = CotizacionComponenteAdjunto()
        if tipo == 'imagen':
            adjunto_cotizacion.imagen = archivo
        elif tipo == 'archivo':
            adjunto_cotizacion.adjunto = archivo
        adjunto_cotizacion.cotizacion_componente = cotizacion_componente
        adjunto_cotizacion.nombre_adjunto = nombre_archivo
        adjunto_cotizacion.creado_por = self.request.user
        adjunto_cotizacion.save()
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def delete_archivo(self, request, pk=None):
        cotizacion_componente = self.get_object()
        adjunto_id = self.request.POST.get('adjunto_id')
        adjunto = CotizacionComponenteAdjunto.objects.get(pk=adjunto_id)
        adjunto.delete()
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)


class ItemCotizacionComponenteViewSet(viewsets.ModelViewSet):
    queryset = ItemCotizacionComponente.objects.select_related('forma_pago', 'forma_pago__canal').all()
    serializer_class = ItemCotizacionComponenteSerializer
