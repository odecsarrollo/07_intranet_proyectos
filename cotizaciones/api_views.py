import datetime
from math import ceil
from django.db.models import Q, When, Case, DecimalField, Value, F, Count
from django.db.models.functions import Coalesce
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from reversion.views import RevisionMixin

from intranet_proyectos.utils_queryset import query_varios_campos
from .models import Cotizacion, SeguimientoCotizacion, ArchivoCotizacion
from .api_serializers import (
    CotizacionSerializer,
    SeguimientoCotizacionSerializer,
    ArchivoCotizacionSerializer,
    CotizacionConDetalleSerializer, CotizacionParaAbrirCarpetaSerializer, CotizacionTuberiaVentaSerializer)


class CotizacionViewSet(RevisionMixin, viewsets.ModelViewSet):
    queryset = Cotizacion.sumatorias.all()
    serializer_class = CotizacionSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CotizacionConDetalleSerializer
        return super().retrieve(request, *args, **kwargs)

    def perform_create(self, serializer):
        self.serializer_class = CotizacionConDetalleSerializer
        super().perform_create(serializer)

    def perform_update(self, serializer):
        self.serializer_class = CotizacionConDetalleSerializer
        super().perform_update(serializer)

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
        ).filter(
            (
                    Q(orden_compra_nro__isnull=False) &
                    Q(estado='Cierre (Aprobado)') &
                    Q(relacionada=False)
            ) |
            (
                    Q(cotizacion_inicial__isnull=False) &
                    Q(estado='Cierre (Aprobado)') &
                    Q(relacionada=False)
            )
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_cotizaciones_x_parametro(self, request):
        parametro = request.GET.get('parametro')
        qs = None
        search_fields = ['nro_cotizacion', 'unidad_negocio']
        if search_fields:
            qs = query_varios_campos(self.queryset, search_fields, parametro)
        self.serializer_class = CotizacionSerializer
        serializer = self.get_serializer(qs, many=True)
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
        month = datetime.datetime.now().month
        year = datetime.datetime.now().year
        qs = self.get_queryset().filter(
            Q(estado__in=[
                'Cita/Generación Interés',
                'Configurando Propuesta',
                'Cotización Enviada',
                'Evaluación Técnica y Económica',
                'Aceptación de Terminos y Condiciones',
            ]) |
            (
                    Q(estado='Cierre (Aprobado)') &
                    Q(orden_compra_fecha__year=year) &
                    Q(orden_compra_fecha__month=month)
            )
        )
        if not self.request.user.has_perm('cotizaciones.list_all_cotizaciones_activas'):
            qs = qs.filter(responsable=self.request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_resumen_tuberia_ventas(self, request):
        year = int(request.GET.get('ano', datetime.datetime.now().year))
        current_date = datetime.datetime.now()
        current_quarter = int(request.GET.get('trimestre', ceil(current_date.month / 3)))
        qsBase = self.get_queryset().annotate(
            valor_orden_compra_mes=Case(
                When(
                    Q(orden_compra_fecha__year=current_date.year) &
                    Q(orden_compra_fecha__month=current_date.month),
                    then=Coalesce(F('valor_orden_compra'), 0)
                ),
                default=Value(0),
                output_field=DecimalField(max_digits=20, decimal_places=2)
            ),
        )
        qs2 = qsBase.filter(
            estado='Cierre (Aprobado)',
            orden_compra_fecha__year=year,
            orden_compra_fecha__quarter=current_quarter
        )

        qs3 = None

        if current_date.year == year and ceil(current_date.month / 3) == current_quarter:
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
