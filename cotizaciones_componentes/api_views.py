from django.db.models import Q, Sum
from django.db.models.functions import Coalesce
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .api_serializers import CotizacionComponenteTuberiaVentasSerializer
from .models import CotizacionComponente, ItemCotizacionComponente, CotizacionComponenteAdjunto
from .api_serializers import (
    CotizacionComponenteSerializer,
    ItemCotizacionComponenteSerializer,
    CotizacionComponenteConDetalleSerializer
)


class CotizacionComponenteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CotizacionComponente.objects.select_related(
        'responsable',
        'creado_por',
        'cliente',
        'cliente__colaborador_componentes',
        'cliente__canal',
        'ciudad',
        'contacto',
        'ciudad__departamento',
        'ciudad__departamento__pais',
    ).prefetch_related(
        'items',
        'items__forma_pago',
        'items__forma_pago__canal',
        'adjuntos',
        'versiones',
        'seguimientos',
        'seguimientos__creado_por',
        'seguimientos__documento_cotizacion',
    ).annotate(
        valor_total=Coalesce(Sum('items__valor_total'), 0)
    ).all()
    serializer_class = CotizacionComponenteSerializer

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
    def relacionar_factura(self, request, pk=None):
        from .services import relacionar_cotizacion_con_factura
        factura_id = request.POST.get('factura_id')
        accion = request.POST.get('accion')
        cotizacion, factura = relacionar_cotizacion_con_factura(
            cotizacion_componente_id=pk,
            factura_id=factura_id,
            accion=accion
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def asignar_consecutivo(self, request, pk=None):
        from .services import cotizacion_componentes_asignar_nro_consecutivo
        cotizacion_componente = cotizacion_componentes_asignar_nro_consecutivo(
            cotizacion_componente=self.get_object())
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        from .services import cotizacion_componentes_cambiar_estado
        cotizacion_componente = self.get_object()
        nuevo_estado = request.POST.get('nuevo_estado', None)
        razon_rechazo = request.POST.get('razon_rechazo', None)
        fecha_verificacion_proximo_seguimiento = request.POST.get('fecha_verificacion_proximo_seguimiento', None)
        cotizacion_componente = cotizacion_componentes_cambiar_estado(
            cotizacion_componente_id=cotizacion_componente.id,
            nuevo_estado=nuevo_estado,
            razon_rechazo=razon_rechazo,
            usuario=self.request.user,
            fecha_verificacion_proximo_seguimiento=fecha_verificacion_proximo_seguimiento
        )
        cotizacion_componente.refresh_from_db()
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    # TODO: Mejorar este método, muchos queries a la hora de enviar
    @action(detail=True, methods=['post'])
    def enviar(self, request, pk=None):
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        from .services import cotizacion_componentes_enviar
        email_uno = request.POST.get('email_uno', None)
        email_dos = request.POST.get('email_dos', None)
        email_tres = request.POST.get('email_tres', None)
        email_cuatro = request.POST.get('email_cuatro', None)
        email_asesor = request.POST.get('email_asesor', None)
        fecha_verificacion_proximo_seguimiento = request.POST.get('fecha_verificacion_proximo_seguimiento', None)

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
            cotizacion_componente=self.queryset.get(pk=pk),
            request=request,
            emails_destino=emails_destino,
            fecha_verificacion_proximo_seguimiento=fecha_verificacion_proximo_seguimiento
        )
        cotizacion_componente.refresh_from_db()
        serializer = self.get_serializer(cotizacion_componente)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def imprimir(self, request, pk=None):
        from .services import cotizacion_componentes_generar_pdf
        response = HttpResponse(content_type='application/pdf')
        output = cotizacion_componentes_generar_pdf(
            cotizacion_componente=self.queryset.get(pk=pk),
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
        tasa = request.POST.get('tasa', 0)
        moneda_origen = request.POST.get('moneda_origen')
        moneda_origen_costo = request.POST.get('moneda_origen_costo', 0)
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
            tipo_transporte=tipo_transporte,
            tasa=tasa,
            moneda_origen=moneda_origen,
            moneda_origen_costo=moneda_origen_costo
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
    def cotizaciones_por_estado(self, request):
        estado = self.request.GET.get('estado')
        lista = self.queryset.filter(
            Q(estado=estado) |
            Q(estado='INI')
        )
        user = self.request.user

        ver_todas = request.user.has_perm('cotizaciones_componentes.list_todos_vendedores_cotizacioncomponente')

        if not (user.is_superuser or ver_todas):
            lista = lista.filter(
                (Q(responsable__isnull=True) & Q(creado_por=user)) |
                (Q(responsable__isnull=False) & Q(responsable=user))
            )

        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_por_cliente(self, request):
        cliente_id = self.request.GET.get('cliente_id')
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        lista = self.queryset.filter(cliente_id=cliente_id)
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_tuberia_ventas(self, request):
        self.serializer_class = CotizacionComponenteTuberiaVentasSerializer
        lista = CotizacionComponente.objects.prefetch_related(
            'responsable',
            'responsable__mi_colaborador',
            'creado_por',
            'cliente',
        ).exclude(estado__in=[
            'INI',
            'ELI',
            'FIN'
        ])
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_por_cliente_para_relacionar_factura(self, request):
        cliente_id = self.request.GET.get('cliente_id')
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        lista = self.queryset.filter(
            Q(cliente_id=cliente_id) &
            Q(estado__in=['PRO', 'FIN', 'ENV', 'REC'])
        )
        user = self.request.user
        if not user.is_superuser:
            lista = lista.filter(
                (Q(responsable__isnull=True) & Q(creado_por=user)) |
                (Q(responsable__isnull=False) & Q(responsable=user))
            )
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_en_edicion_asesor(self, request):
        user = self.request.user
        self.serializer_class = CotizacionComponenteConDetalleSerializer
        lista = self.queryset.filter(estado='INI')
        if not user.is_superuser:
            lista = self.queryset.filter(estado='INI').filter(
                (Q(responsable__isnull=True) & Q(creado_por=user)) |
                (Q(responsable__isnull=False) & Q(responsable=user))
            )
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
    queryset = ItemCotizacionComponente.objects.select_related(
        'forma_pago',
        'forma_pago__canal',
        'cotizacion'
    ).all()
    serializer_class = ItemCotizacionComponenteSerializer

    @action(detail=False, http_method_names=['get', ])
    def items_por_cliente_historico(self, request):
        cliente_id = self.request.GET.get('cliente_id')
        parametro = self.request.GET.get('parametro')
        lista = self.queryset.filter(
            Q(cotizacion__cliente_id=cliente_id) &
            (
                    Q(descripcion__icontains=parametro) |
                    Q(referencia__icontains=parametro) |
                    Q(articulo_catalogo__item_sistema_informacion__descripcion__icontains=parametro) |
                    Q(articulo_catalogo__item_sistema_informacion__id_referencia__icontains=parametro) |
                    Q(banda_eurobelt__referencia__icontains=parametro) |
                    Q(banda_eurobelt__nombre__icontains=parametro) |
                    Q(componente_eurobelt__nombre__icontains=parametro) |
                    Q(componente_eurobelt__referencia__icontains=parametro)
            )
        ).distinct()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
