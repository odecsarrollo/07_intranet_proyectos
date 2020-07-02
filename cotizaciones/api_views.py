import json
from math import ceil
from django.db.models import Q, When, Case, DecimalField, Value, F, Count
from django.db.models.functions import Coalesce
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from reversion.views import RevisionMixin

from intranet_proyectos.utils_queryset import query_varios_campos
from .api_serializers import CotizacionInformeGerenciaSerializer
from .models import Cotizacion, SeguimientoCotizacion, ArchivoCotizacion, CondicionInicioProyecto, \
    CondicionInicioProyectoCotizacion
from .api_serializers import (
    CotizacionSerializer,
    SeguimientoCotizacionSerializer,
    ArchivoCotizacionSerializer,
    CotizacionConDetalleSerializer,
    CotizacionParaAbrirCarpetaSerializer,
    CotizacionTuberiaVentaSerializer,
    CotizacionListSerializer,
    CondicionInicioProyectoSerializer,
    CondicionInicioProyectoCotizacionSerializer,
)


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
        'cotizacion_inicial__cliente',
        'cotizacion_inicial__contacto_cliente',
        'responsable'
    ).prefetch_related(
        'proyectos',
        'cotizaciones_adicionales__contacto_cliente',
        'cotizacion_inicial__cotizaciones_adicionales',
        'cotizaciones_adicionales__cotizaciones_adicionales',
        'ordenes_compra'
    ).all()

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = Cotizacion.objects.select_related(
            'cliente',
            'contacto_cliente',
            'cotizacion_inicial__cliente',
            'cotizacion_inicial__contacto_cliente',
            'responsable'
        ).prefetch_related(
            'proyectos',
            'literales',
            'ordenes_compra',
            'condiciones_inicio_cotizacion',
            'cotizacion_inicial__cotizaciones_adicionales',
            'cotizaciones_adicionales__contacto_cliente',
            'cotizaciones_adicionales__cotizaciones_adicionales',
            'mis_documentos__creado_por',
            'mis_seguimientos__creado_por',
        ).all()
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CotizacionConDetalleSerializer
        return super().update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.serializer_class = CotizacionListSerializer
        self.queryset = self.list_queryset
        return super().list(request, *args, **kwargs)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_por_ano_mes(self, request):
        months = self.request.GET.get('months').split(',')
        years = self.request.GET.get('years').split(',')
        self.serializer_class = CotizacionInformeGerenciaSerializer
        self.queryset = Cotizacion.objects.select_related(
            'cliente',
            'responsable'
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
    def adicionar_orden_compra(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        orden_compra_archivo = request.FILES.get('orden_compra_archivo')
        orden_compra_fecha = request.POST.get('orden_compra_fecha', None)
        valor_orden_compra = request.POST.get('valor_orden_compra', None)
        orden_compra_nro = request.POST.get('orden_compra_nro', None)
        plan_pago = request.POST.get('plan_pago', None)
        from .services import cotizacion_add_orden_compra
        orden_compra = cotizacion_add_orden_compra(
            cotizacion_id=pk,
            orden_compra_fecha=orden_compra_fecha,
            orden_compra_nro=orden_compra_nro,
            valor_orden_compra=valor_orden_compra,
            orden_compra_archivo=orden_compra_archivo
        )
        planes_de_pagos = json.loads(plan_pago)
        for pp in json.loads(plan_pago):
            orden_compra.planes_pagos.create(
                fecha=planes_de_pagos[pp].get('fecha'),
                porcentaje=planes_de_pagos[pp].get('porcentaje'),
                valor=planes_de_pagos[pp].get('valor')
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
        ).all()
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
        qsBase = Cotizacion.objects.select_related(
            'cliente',
            'contacto_cliente',
            'cotizacion_inicial__cliente',
            'cotizacion_inicial__contacto_cliente',
            'responsable'
        ).annotate(
            valor_orden_compra_mes=Case(
                When(
                    Q(orden_compra_fecha__year=year) &
                    Q(orden_compra_fecha__month=month),
                    then=Coalesce(F('valor_orden_compra'), 0)
                ),
                default=Value(0),
                output_field=DecimalField(max_digits=20, decimal_places=2)
            ),
        )
        qs2 = qsBase.filter(
            estado='Cierre (Aprobado)'
        )

        qs3 = None

        if not filtro_ano or not filtro_mes:
            qs2 = qs2.annotate(valor_orden_compra_trimestre=Coalesce(F('valor_orden_compra'), 0)).filter(
                orden_compra_fecha__year=year,
                orden_compra_fecha__quarter=current_quarter
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
        qsFinal = None
        if qs2:
            qsFinal = qs2
        if qs3:
            if qsFinal:
                qsFinal = qsFinal | qs3
            else:
                qsFinal = qs3
        serializer = self.get_serializer(qsFinal, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upload_archivo(self, request, pk=None):
        nombre_archivo = self.request.POST.get('nombre')
        cotizacion = self.get_object()
        archivo = self.request.FILES['archivo']
        archivo_cotizacion = ArchivoCotizacion()
        archivo_cotizacion.archivo = archivo
        archivo_cotizacion.cotizacion = cotizacion
        archivo_cotizacion.nombre_archivo = nombre_archivo
        archivo_cotizacion.creado_por = self.request.user
        archivo_cotizacion.save()
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

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_cotizacion(self, request):
        cotizacion_id = request.GET.get('cotizacion_id')
        qs = self.get_queryset().filter(cotizacion_id=cotizacion_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
