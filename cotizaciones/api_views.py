import datetime
import json
from math import ceil

from django.db.models import Case
from django.db.models import Count
from django.db.models import DecimalField
from django.db.models import ExpressionWrapper
from django.db.models import F
from django.db.models import OuterRef
from django.db.models import Q
from django.db.models import Subquery
from django.db.models import Sum
from django.db.models import Value
from django.db.models import When
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from reversion.views import RevisionMixin

from intranet_proyectos.utils_queryset import query_varios_campos
from .api_serializers import ArchivoCotizacionSerializer
from .api_serializers import CondicionInicioProyectoCotizacionSerializer
from .api_serializers import CondicionInicioProyectoSerializer
from .api_serializers import CotizacionConDetalleSerializer
from .api_serializers import CotizacionInformeGerenciaSerializer
from .api_serializers import CotizacionListSerializer
from .api_serializers import CotizacionParaAbrirCarpetaSerializer
from .api_serializers import CotizacionSerializer
from .api_serializers import CotizacionTuberiaVentaSerializer
from .api_serializers import SeguimientoCotizacionSerializer
from .models import ArchivoCotizacion
from .models import CondicionInicioProyecto
from .models import CondicionInicioProyectoCotizacion
from .models import Cotizacion
from .models import CotizacionPagoProyectado
from .models import CotizacionPagoProyectadoAcuerdoPago
from .models import CotizacionPagoProyectadoAcuerdoPagoPago
from .models import SeguimientoCotizacion


class CondicionInicioProyectoViewSet(viewsets.ModelViewSet):
    queryset = CondicionInicioProyecto.objects.all()
    serializer_class = CondicionInicioProyectoSerializer


class CondicionInicioProyectoCotizacionViewSet(viewsets.ModelViewSet):
    queryset = CondicionInicioProyectoCotizacion.objects.all()
    serializer_class = CondicionInicioProyectoCotizacionSerializer


class CotizacionViewSet(RevisionMixin, viewsets.ModelViewSet):
    queryset = Cotizacion.sumatorias.all()
    serializer_class = CotizacionSerializer
    list_queryset = Cotizacion.objects.select_related(
        'cliente',
        'contacto_cliente',
        'cotizacion_inicial',
        'cotizacion_inicial__cliente',
        'cotizacion_inicial__contacto_cliente',
        'responsable'
    ).prefetch_related(
        'proyectos',
        'pagos_proyectados',
        'cotizaciones_adicionales__contacto_cliente',
        'cotizacion_inicial__cotizaciones_adicionales',
        'cotizaciones_adicionales__cotizaciones_adicionales',
        'pagos_proyectados'
    ).annotate(
        valores_oc=Coalesce(Sum('pagos_proyectados__valor_orden_compra'), 0),
    ).all()
    _pagos_cotizacion = CotizacionPagoProyectadoAcuerdoPagoPago.objects.values(
        'acuerdo_pago__orden_compra__cotizacion_id'
    ).filter(valor__gt=0).annotate(
        total=Sum('valor')
    ).filter(acuerdo_pago__orden_compra__cotizacion_id=OuterRef('id'))

    _cotizaciones_adicionales = Cotizacion.objects.values('cotizacion_inicial__id').annotate(
        costo_presupuestado_adicionales=Sum('costo_presupuestado'),
        valores_oc_adicionales=Coalesce(Sum('pagos_proyectados__valor_orden_compra'), 0),
        pagos_adicionales=ExpressionWrapper(
            Subquery(_pagos_cotizacion.values('total')),
            output_field=DecimalField(max_digits=12, decimal_places=4)
        ),
    ).filter(
        cotizacion_inicial__id=OuterRef('id'),
        estado='Cierre (Aprobado)'
    ).distinct()

    detail_queryset = Cotizacion.objects.select_related(
        'cliente',
        'contacto_cliente',
        'cotizacion_inicial__cliente',
        'cotizacion_inicial__contacto_cliente',
        'responsable'
    ).prefetch_related(
        'proyectos',
        'literales',
        'pagos_proyectados',
        'pagos_proyectados__acuerdos_pagos',
        'pagos_proyectados__acuerdos_pagos__pagos',
        'condiciones_inicio_cotizacion',
        'cotizacion_inicial__cotizaciones_adicionales',
        'cotizaciones_adicionales__contacto_cliente',
        'cotizaciones_adicionales__cotizaciones_adicionales',
        'mis_documentos__creado_por',
        'mis_seguimientos__creado_por',
    ).annotate(
        valores_oc=Coalesce(Sum('pagos_proyectados__valor_orden_compra'), 0),
        pagos=ExpressionWrapper(
            Subquery(_pagos_cotizacion.values('total')),
            output_field=DecimalField(max_digits=12, decimal_places=4)
        ),
        valores_oc_adicionales=ExpressionWrapper(
            Subquery(_cotizaciones_adicionales.values('valores_oc_adicionales')),
            output_field=DecimalField(max_digits=12, decimal_places=4)
        ),
        costo_presupuestado_adicionales=ExpressionWrapper(
            Subquery(_cotizaciones_adicionales.values('costo_presupuestado_adicionales')),
            output_field=DecimalField(max_digits=12, decimal_places=4)
        ),
        pagos_adicionales=ExpressionWrapper(
            Subquery(_cotizaciones_adicionales.values('pagos_adicionales')),
            output_field=DecimalField(max_digits=12, decimal_places=4)
        ),
    ).all()

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = self.detail_queryset
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = self.detail_queryset
        return super().update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        # from clientes.tasks import simulate_send_emails
        # simulate_send_emails.delay(5)
        self.serializer_class = CotizacionListSerializer
        if self.request.user.is_superuser:
            cotizaciones_para_convertir = Cotizacion.objects.filter(
                Q(estado='Cierre (Aprobado)') &
                (
                        Q(valor_orden_compra__gt=0) |
                        Q(orden_compra_nro__isnull=False) |
                        Q(orden_compra_fecha__isnull=False) |
                        Q(orden_compra_archivo=False)
                )
            ).all()
            for cpc in cotizaciones_para_convertir:
                pago_proyectado = CotizacionPagoProyectado()
                pago_proyectado.valor_orden_compra = cpc.valor_orden_compra
                pago_proyectado.orden_compra_fecha = cpc.orden_compra_fecha
                pago_proyectado.orden_compra_nro = cpc.orden_compra_nro
                pago_proyectado.orden_compra_archivo = cpc.orden_compra_archivo
                pago_proyectado.notificada_por_correo = True
                pago_proyectado.cotizacion_id = cpc.id
                pago_proyectado.creado_por_id = 1
                pago_proyectado.save()

                CotizacionPagoProyectadoAcuerdoPago.objects.create(
                    orden_compra=pago_proyectado,
                    motivo='MIGRADO',
                    porcentaje=100,
                    creado_por_id=1,
                    valor_proyectado=pago_proyectado.valor_orden_compra
                )
                cpc.valor_orden_compra = 0
                cpc.orden_compra_fecha = None
                cpc.orden_compra_nro = None
                cpc.orden_compra_archivo = None
                cpc.save()

            if not cotizaciones_para_convertir.exists():
                pago_proyectados = CotizacionPagoProyectado.objects.filter(
                    orden_compra_documento__isnull=True,
                ).all()
                for pp in pago_proyectados:
                    if pp.orden_compra_archivo:
                        ArchivoCotizacion.objects.create(
                            cotizacion_id=pp.cotizacion_id,
                            orden_compra_id=pp.id,
                            creado_por_id=pp.creado_por_id,
                            tipo='ORDENCOMPRA',
                            archivo=pp.orden_compra_archivo,
                            nombre_archivo='OC_%s' % pp.orden_compra_nro
                        )
                        pp.orden_compra_archivo = None
                        pp.save()
        return super().list(request, *args, **kwargs)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_por_ano_mes(self, request):
        months = self.request.GET.get('months').split(',')
        years = self.request.GET.get('years').split(',')

        _ordenes_compra = CotizacionPagoProyectado.objects.values('cotizacion_id').annotate(
            valor=Sum('valor_orden_compra')
        ).filter(
            cotizacion_id=OuterRef('id'),
            cotizacion__estado='Cierre (Aprobado)',
            orden_compra_fecha__year__in=years,
            orden_compra_fecha__month__in=months
        ).distinct()

        self.serializer_class = CotizacionInformeGerenciaSerializer
        self.queryset = Cotizacion.objects.select_related(
            'cliente',
            'responsable'
        ).annotate(
            valor_oc_nuevas=ExpressionWrapper(
                Subquery(_ordenes_compra.values('valor')),
                output_field=DecimalField(max_digits=12, decimal_places=4)
            ),
            valor_oc_viejas=Case(
                When(
                    Q(orden_compra_fecha__year__in=years) &
                    Q(orden_compra_fecha__month__in=months),
                    then=Coalesce(F('valor_orden_compra'), 0)
                ),
                default=Value(0),
                output_field=DecimalField(max_digits=20, decimal_places=2)
            )
        ).all()
        lista = self.queryset.filter(
            Q(
                orden_compra_fecha__year__in=years,
                orden_compra_fecha__month__in=months,
                estado='Cierre (Aprobado)'
            ) |
            Q(
                estado__in=[
                    'Cotización Enviada',
                    'Evaluación Técnica y Económica',
                    'Aceptación de Terminos y Condiciones'
                ]
            )
        )
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_fecha_proximo_seguimiento(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        fecha_limite_segumiento_estado = request.POST.get('fecha_limite_segumiento_estado', None)
        from .services import cotizacion_cambiar_fecha_proximo_seguimiento
        cotizacion_cambiar_fecha_proximo_seguimiento(
            cotizacion_id=pk,
            fecha_limite_segumiento_estado=fecha_limite_segumiento_estado,
            usuario=self.request.user
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cambiar_fecha_proyectada_acuerdo_pago(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = self.detail_queryset
        from .services import acuerdo_pago_cambiar_fecha_proyectada
        fecha_proyectada = request.POST.get('fecha_proyectada', None)
        acuerdo_pago_id = request.POST.get('acuerdo_pago_id', None)
        acuerdo_pago_cambiar_fecha_proyectada(
            cotizacion_id=pk,
            acuerdo_pago_id=acuerdo_pago_id,
            nueva_fecha_proyectada=fecha_proyectada
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_pago_proyectado_desde_vieja(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = self.detail_queryset
        cotizacion = Cotizacion.objects.get(pk=pk)
        orden_compra_archivo = cotizacion.orden_compra_archivo
        if not orden_compra_archivo:
            orden_compra_archivo = request.FILES.get('orden_compra_archivo')
        orden_compra_fecha = request.POST.get('orden_compra_fecha', None)
        valor_orden_compra = request.POST.get('valor_orden_compra', None)
        orden_compra_nro = request.POST.get('orden_compra_nro', None)
        plan_pago = request.POST.get('plan_pago', None)
        from .services import cotizacion_add_pago_proyectado
        pago_proyectado = cotizacion_add_pago_proyectado(
            cotizacion_id=pk,
            orden_compra_fecha=orden_compra_fecha,
            orden_compra_nro=orden_compra_nro,
            valor_orden_compra=valor_orden_compra,
            orden_compra_archivo=orden_compra_archivo,
            user_id=self.request.user.id,
            no_enviar_correo=True
        )

        cotizacion.orden_compra_archivo = None
        cotizacion.orden_compra_fecha = None
        cotizacion.orden_compra_nro = None
        cotizacion.valor_orden_compra = 0
        cotizacion.save()

        acuerdos_de_pago = json.loads(plan_pago)
        for pp in json.loads(plan_pago):
            pago_proyectado.acuerdos_pagos.create(
                motivo=acuerdos_de_pago[pp].get('motivo'),
                fecha_proyectada=acuerdos_de_pago[pp].get('fecha_proyectada'),
                valor_proyectado=acuerdos_de_pago[pp].get('valor_proyectado'),
                porcentaje=acuerdos_de_pago[pp].get('porcentaje')
            )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_pago_proyectado(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = self.detail_queryset
        orden_compra_archivo = request.FILES.get('orden_compra_archivo')
        orden_compra_fecha = request.POST.get('orden_compra_fecha', None)
        valor_orden_compra = request.POST.get('valor_orden_compra', None)
        orden_compra_nro = request.POST.get('orden_compra_nro', None)
        plan_pago = request.POST.get('plan_pago', None)
        from .services import cotizacion_add_pago_proyectado
        pago_proyectado = cotizacion_add_pago_proyectado(
            cotizacion_id=pk,
            orden_compra_fecha=orden_compra_fecha,
            orden_compra_nro=orden_compra_nro,
            valor_orden_compra=valor_orden_compra,
            orden_compra_archivo=orden_compra_archivo,
            user_id=self.request.user.id
        )
        acuerdos_de_pago = json.loads(plan_pago)
        for pp in json.loads(plan_pago):
            fecha_proyectada = acuerdos_de_pago[pp].get('fecha_proyectada')
            fecha_proyectada_date = datetime.datetime.strptime(
                fecha_proyectada,
                "%Y-%m-%d"
            ).date() if fecha_proyectada else None
            pago_proyectado.acuerdos_pagos.create(
                motivo=acuerdos_de_pago[pp].get('motivo'),
                creado_por_id=self.request.user.id,
                fecha_proyectada=fecha_proyectada_date,
                valor_proyectado=acuerdos_de_pago[pp].get('valor_proyectado'),
                porcentaje=acuerdos_de_pago[pp].get('porcentaje')
            )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_pago(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = self.detail_queryset
        comprobante_pago = request.FILES.get('comprobante_pago')
        fecha = request.POST.get('fecha', None)
        acuerdo_pago_id = request.POST.get('acuerdo_pago_id', None)
        valor = request.POST.get('valor', None)
        from .services import cotizacion_add_pago
        cotizacion_add_pago(
            cotizacion_id=int(pk),
            comprobante_pago=comprobante_pago,
            acuerdo_pago_id=acuerdo_pago_id,
            fecha=fecha,
            valor=valor,
            user_id=self.request.user.id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_pago(self, request, pk=None):
        pago_id = request.POST.get('pago_id', None)
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = self.detail_queryset
        from .services import cotizacion_eliminar_pago
        cotizacion_eliminar_pago(
            pago_id=pago_id,
            cotizacion_id=pk,
            user_id=self.request.user.id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def eliminar_pago_proyectado(self, request, pk=None):
        orden_compra_id = request.POST.get('orden_compra_id', None)
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = self.detail_queryset
        from .services import cotizacion_eliminar_pago_proyectado
        cotizacion_eliminar_pago_proyectado(
            cotizacion_id=pk,
            pago_proyectado_id=orden_compra_id,
            user_id=self.request.user.id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_con_proyectos(self, request):
        self.queryset = Cotizacion.sumatorias.annotate(
            cantidad_proyectos=Count('proyectos')
        ).prefetch_related('proyectos').filter(
            (
                    Q(cotizacion_inicial__isnull=True) &
                    Q(cantidad_proyectos__gt=0)
            ) | (
                    Q(cotizacion_inicial__isnull=False) &
                    Q(estado='Cierre (Aprobado)')
            )
        ).all()
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_cotizacion_abrir_carpeta(self, request):
        self.serializer_class = CotizacionParaAbrirCarpetaSerializer
        qs = Cotizacion.objects.prefetch_related(
            'cliente',
            'cotizacion_inicial__cliente'
        ).exclude(revisada=True).filter(estado='Cierre (Aprobado)')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_cotizaciones_x_parametro(self, request):
        parametro = request.GET.get('parametro')
        qs = None
        search_fields = ['nro_cotizacion', 'unidad_negocio', 'estado']
        if search_fields:
            qs = query_varios_campos(self.queryset, search_fields, parametro)
        self.serializer_class = CotizacionSerializer
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_quitar_condicion_inicio(self, request, pk=None):
        tipo_accion = self.request.POST.get('tipo_accion', None)
        self.serializer_class = CotizacionConDetalleSerializer
        condicion_inicio_proyecto_id = self.request.POST.get('condicion_inicio_proyecto_id', None)
        from .services import cotizacion_adicionar_quitar_condicion_inicio_proyecto
        cotizacion = cotizacion_adicionar_quitar_condicion_inicio_proyecto(
            tipo_accion=tipo_accion,
            cotizacion_id=pk,
            condicion_inicio_proyecto_id=condicion_inicio_proyecto_id,
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def relacionar_quitar_proyecto(self, request, pk=None):
        cotizacion = self.get_object()
        self.serializer_class = CotizacionConDetalleSerializer
        proyecto_id = int(request.POST.get('proyecto_id'))
        from .services import cotizacion_quitar_relacionar_proyecto
        cotizacion = cotizacion_quitar_relacionar_proyecto(
            proyecto_id=proyecto_id,
            cotizacion_id=cotizacion.id
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def limpiar_condicion_inicio_proyecto(self, request, pk=None):
        cotizacion = self.get_object()
        self.serializer_class = CotizacionConDetalleSerializer
        condicion_inicio_proyecto_id = request.POST.get('condicion_inicio_proyecto_id', None)
        es_orden_compra = request.POST.get('es_orden_compra', False)
        from .services import cotizacion_limpiar_condicion_inicio_proyecto
        cotizacion = cotizacion_limpiar_condicion_inicio_proyecto(
            condicion_inicio_proyecto_id=condicion_inicio_proyecto_id,
            cotizacion_id=cotizacion.id,
            es_orden_compra=es_orden_compra
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_quitar_condicion_inicio_proyecto(self, request, pk=None):
        cotizacion = self.get_object()
        self.serializer_class = CotizacionConDetalleSerializer
        tipo_accion = int(request.POST.get('tipo_accion'))
        condicion_inicio_proyecto_id = int(request.POST.get('condicion_inicio_proyecto_id'))
        from .services import cotizacion_adicionar_quitar_condicion_inicio_proyecto
        cotizacion = cotizacion_adicionar_quitar_condicion_inicio_proyecto(
            condicion_inicio_proyecto_id=condicion_inicio_proyecto_id,
            cotizacion_id=cotizacion.id,
            tipo_accion=tipo_accion
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def relacionar_quitar_literal(self, request, pk=None):
        cotizacion = self.get_object()
        self.serializer_class = CotizacionConDetalleSerializer
        literal_id = int(request.POST.get('literal_id'))
        from .services import cotizacion_quitar_relacionar_literal
        cotizacion = cotizacion_quitar_relacionar_literal(
            literal_id=literal_id,
            cotizacion_id=cotizacion.id
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def convertir_en_adicional(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        cotizacion_inicial_id = request.POST.get('cotizacion_inicial_id')
        from .services import cotizacion_convertir_en_adicional
        cotizacion = cotizacion_convertir_en_adicional(
            cotizacion_id=pk,
            cotizacion_inicial_id=cotizacion_inicial_id
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def set_revisado(self, request, pk=None):
        cotizacion = self.get_object()
        self.serializer_class = CotizacionConDetalleSerializer
        from .services import cotizacion_set_revisado
        cotizacion = cotizacion_set_revisado(
            cotizacion_id=cotizacion.id
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_cotizaciones_agendadas(self, request):
        qs = self.get_queryset().filter(fecha_entrega_pactada_cotizacion__isnull=False,
                                        estado__in=['Cita/Generación Interés', 'Configurando Propuesta'])
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_cotizaciones_tuberia_ventas(self, request):
        self.queryset = Cotizacion.objects.select_related(
            'cliente',
            'contacto_cliente',
            'cotizacion_inicial__cliente',
            'cotizacion_inicial__contacto_cliente',
            'responsable'
        ).annotate(
            nro_pagos_proyectados=Count('pagos_proyectados')
        )
        self.serializer_class = CotizacionTuberiaVentaSerializer
        qs = self.get_queryset().annotate(
            numero_condiciones_inicio=Count('condiciones_inicio_cotizacion')
        ).filter(
            Q(estado__in=[
                'Cita/Generación Interés',
                'Configurando Propuesta',
                'Cotización Enviada',
                'Evaluación Técnica y Económica',
                'Aceptación de Terminos y Condiciones',
            ]) |
            (
                    Q(estado='Cierre (Aprobado)') &
                    Q(nro_pagos_proyectados__lte=0) &
                    (
                            Q(orden_compra_nro__isnull=True) |
                            Q(valor_orden_compra__isnull=True) |
                            Q(orden_compra_fecha__isnull=True) |
                            Q(orden_compra_archivo__isnull=True) |
                            (
                                    Q(condiciones_inicio_cotizacion__fecha_entrega__isnull=True) &
                                    Q(numero_condiciones_inicio__gt=0)
                            )
                    )
            )
        )
        if not self.request.user.has_perm('cotizaciones.list_all_cotizaciones_activas'):
            qs = qs.filter(responsable=self.request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_resumen_tuberia_ventas(self, request):
        self.serializer_class = CotizacionTuberiaVentaSerializer
        filtro_ano = request.GET.get('ano', None)
        filtro_mes = request.GET.get('mes', None)
        year = int(filtro_ano) if filtro_ano else timezone.datetime.now().year
        month = int(filtro_mes) if filtro_mes else timezone.datetime.now().month
        current_date = timezone.datetime.now()
        current_quarter = int(ceil(current_date.month / 3))
        _ordenes_compra = CotizacionPagoProyectado.objects.values('cotizacion_id').annotate(
            valor_oc=Sum('valor_orden_compra')
        ).filter(
            cotizacion_id=OuterRef('id'),
            cotizacion__estado='Cierre (Aprobado)',
            orden_compra_fecha__year=year,
            orden_compra_fecha__month=month
        ).distinct()

        qsBase = Cotizacion.objects.select_related(
            'cliente',
            'contacto_cliente',
            'cotizacion_inicial__cliente',
            'cotizacion_inicial__contacto_cliente',
            'responsable'
        ).annotate(
            valor_orden_compra_mes_vieja=Case(
                When(
                    Q(orden_compra_fecha__year=year) &
                    Q(orden_compra_fecha__month=month) &
                    Q(estado='Cierre (Aprobado)'),
                    then=Coalesce(F('valor_orden_compra'), 0)
                ),
                default=Value(0),
                output_field=DecimalField(max_digits=20, decimal_places=2)
            ),
            valor_orden_compra_mes_nueva=ExpressionWrapper(
                Subquery(_ordenes_compra.values('valor_oc')),
                output_field=DecimalField(max_digits=12, decimal_places=4)
            )
        ).annotate(
            valor_orden_compra_mes=Coalesce(F('valor_orden_compra_mes_vieja'), 0) + Coalesce(
                F('valor_orden_compra_mes_nueva'), 0)
        )
        qs2 = qsBase.filter(
            estado='Cierre (Aprobado)'
        )

        qs3 = None
        filtro_mes_o_ano = filtro_ano and filtro_mes
        if not filtro_mes_o_ano:
            _ordenes_compra_trimestre = CotizacionPagoProyectado.objects.values('cotizacion_id').annotate(
                valor_oc=Sum('valor_orden_compra')
            ).filter(
                cotizacion_id=OuterRef('id'),
                orden_compra_fecha__year=year,
                orden_compra_fecha__quarter=current_quarter
            ).distinct()

            qs2 = qs2.annotate(
                valor_orden_compra_trimestre_vieja=
                Case(
                    When(
                        Q(orden_compra_fecha__year=year) &
                        Q(orden_compra_fecha__quarter=current_quarter),
                        then=Coalesce(F('valor_orden_compra'), 0)
                    ),
                    default=Value(0),
                    output_field=DecimalField(max_digits=20, decimal_places=2)
                ),
                valor_orden_compra_trimestre_nueva=ExpressionWrapper(
                    Subquery(_ordenes_compra_trimestre.values('valor_oc')),
                    output_field=DecimalField(max_digits=12, decimal_places=4)
                )
            ).annotate(
                valor_orden_compra_trimestre=Coalesce(F('valor_orden_compra_trimestre_vieja'), 0) + Coalesce(
                    F('valor_orden_compra_trimestre_nueva'), 0)
            )
            qs3 = qsBase.filter(
                estado__in=[
                    'Cita/Generación Interés',
                    'Configurando Propuesta',
                    'Cotización Enviada',
                    'Evaluación Técnica y Económica',
                    'Aceptación de Terminos y Condiciones',
                ]
            )
        if filtro_mes_o_ano:
            # Sólo ira el valor de las ordenes de compra
            qsFinal = qs2.filter(Q(valor_orden_compra_mes__gt=0))
        else:
            qs2 = qs2.filter(Q(valor_orden_compra_mes__gt=0) | Q(valor_orden_compra_trimestre__gt=0))
            qsFinal = qs2 | qs3
        serializer = self.get_serializer(qsFinal, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upload_archivo(self, request, pk=None):
        nombre_archivo = self.request.POST.get('nombre')
        tipo = self.request.POST.get('tipo')
        cotizacion = self.get_object()
        self.serializer_class = CotizacionConDetalleSerializer
        from .services import cotizacion_upload_documento
        cotizacion_upload_documento(
            cotizacion_id=pk,
            user_id=self.request.user.id,
            nombre_archivo=nombre_archivo,
            archivo=self.request.FILES['archivo'],
            tipo=tipo
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def actualizar_orden_compra(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer

        serializer = self.get_serializer(self.get_object(), data=request.data.dict(), partial=True)
        serializer.is_valid(raise_exception=True)

        orden_compra_fecha = serializer.validated_data.get('orden_compra_fecha', None)
        valor_orden_compra = serializer.validated_data.get('valor_orden_compra', 0)
        orden_compra_nro = serializer.validated_data.get('orden_compra_nro', None)
        orden_compra_archivo = self.request.FILES.get('orden_compra_archivo', None)
        from .services import cotizacion_condicion_inicio_orden_compra_actualizar
        cotizacion = cotizacion_condicion_inicio_orden_compra_actualizar(
            cotizacion_id=pk,
            orden_compra_fecha=orden_compra_fecha,
            valor_orden_compra=valor_orden_compra,
            orden_compra_nro=orden_compra_nro,
            orden_compra_archivo=orden_compra_archivo
        )
        serializer = self.get_serializer(cotizacion)
        return Response(serializer.data)


class SeguimientoCotizacionViewSet(viewsets.ModelViewSet):
    queryset = SeguimientoCotizacion.objects.select_related(
        'creado_por',
        'cotizacion__cliente'
    ).all()
    serializer_class = SeguimientoCotizacionSerializer

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_cotizacion(self, request):
        cotizacion_id = request.GET.get('cotizacion_id')
        qs = self.get_queryset().filter(cotizacion_id=cotizacion_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_tareas_pendientes(self, request):
        qs = SeguimientoCotizacion.objects.filter(
            tipo_seguimiento=2,
            tarea_terminada=False
        ).all()
        listar_todas = self.request.user.has_perm('cotizaciones.list_all_cotizacion')
        if not listar_todas:
            qs = qs.filter(cotizacion__responsable=self.request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ArchivoCotizacionViewSet(viewsets.ModelViewSet):
    queryset = ArchivoCotizacion.objects.select_related('cotizacion', 'creado_por').all()
    serializer_class = ArchivoCotizacionSerializer

    def destroy(self, request, *args, **kwargs):
        from .services import archivo_cotizacion_eliminar
        archivo_cotizacion_eliminar(
            archivo_cotizacion_id=self.get_object().id
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_cotizacion(self, request):
        cotizacion_id = request.GET.get('cotizacion_id')
        qs = self.get_queryset().filter(cotizacion_id=cotizacion_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
