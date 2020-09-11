import datetime
import json
from math import ceil

from django.db import transaction
from django.db.models import Count
from django.db.models import DecimalField
from django.db.models import ExpressionWrapper
from django.db.models import OuterRef
from django.db.models import Q
from django.db.models import Subquery
from django.db.models import Sum
from django.utils import timezone
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from reversion.views import RevisionMixin

from intranet_proyectos.utils_queryset import query_varios_campos
from .serializers import ArchivoCotizacionSerializer
from .serializers import CondicionInicioProyectoCotizacionSerializer
from .serializers import CondicionInicioProyectoSerializer
from .serializers import CotizacionConDetalleSerializer
from .serializers import CotizacionInformeGerenciaSerializer
from .serializers import CotizacionListSerializer
from .serializers import CotizacionPagoProyectadoAcuerdoPagoInformeGerenciaSerializer
from .serializers import CotizacionPagoProyectadoAcuerdoPagoSerializer
from .serializers import CotizacionPagoProyectadoInformeGerencialSerializer
from .serializers import CotizacionPagoProyectadoSerializer
from .serializers import CotizacionParaAbrirCarpetaSerializer
from .serializers import CotizacionSerializer
from .serializers import CotizacionTuberiaVentaSerializer
from .serializers import SeguimientoCotizacionSerializer
from .serializers import CotizacionPagoProyectadoAcuerdoPago
from .models import ArchivoCotizacion
from .models import CondicionInicioProyecto
from .models import CondicionInicioProyectoCotizacion
from .models import Cotizacion
from .models import CotizacionPagoProyectado
from .models import SeguimientoCotizacion


class CondicionInicioProyectoViewSet(viewsets.ModelViewSet):
    queryset = CondicionInicioProyecto.objects.all()
    serializer_class = CondicionInicioProyectoSerializer


class CondicionInicioProyectoCotizacionViewSet(viewsets.ModelViewSet):
    queryset = CondicionInicioProyectoCotizacion.objects.all()
    serializer_class = CondicionInicioProyectoCotizacionSerializer


class CotizacionViewSet(RevisionMixin, viewsets.ModelViewSet):
    queryset = Cotizacion.base.lista_cotizaciones().all()
    serializer_class = CotizacionSerializer

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = Cotizacion.base.detalle_cotizacion()
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = Cotizacion.base.detalle_cotizacion()
        return super().update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.queryset = Cotizacion.base.lista_cotizaciones().using('read_only')
        self.serializer_class = CotizacionListSerializer
        return super().list(request, *args, **kwargs)

    # region No Detail Actions
    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_informe_gerencial(self, request):
        self.serializer_class = CotizacionInformeGerenciaSerializer
        lista = Cotizacion.objects.using('read_only').select_related(
            'cliente',
            'responsable'
        ).filter(
            estado__in=[
                'Cotización Enviada',
                'Evaluación Técnica y Económica',
                'Aceptación de Terminos y Condiciones'
            ]
        ).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def cotizaciones_con_proyectos(self, request):
        self.queryset = Cotizacion.base.lista_cotizaciones().annotate(
            cantidad_proyectos=Count('proyectos')
        ).prefetch_related('proyectos').filter(
            (
                    Q(cotizacion_inicial__isnull=True) &
                    Q(cantidad_proyectos__gt=0)
            ) | (
                    Q(cotizacion_inicial__isnull=False) &
                    Q(estado='Cierre (Aprobado)')
            )
        ).using('read_only').all()
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_cotizacion_abrir_carpeta(self, request):
        self.serializer_class = CotizacionParaAbrirCarpetaSerializer
        qs = Cotizacion.objects.using('read_only').prefetch_related(
            'cliente',
            'cotizacion_inicial__cliente'
        ).exclude(revisada=True).filter(estado='Cierre (Aprobado)')
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_cotizaciones_x_parametro(self, request):
        self.queryset = self.queryset.using('read_only')
        parametro = request.GET.get('parametro')
        qs = None
        search_fields = ['nro_cotizacion', 'unidad_negocio', 'estado']
        if search_fields:
            qs = query_varios_campos(self.queryset, search_fields, parametro)
        self.serializer_class = CotizacionSerializer
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_cotizaciones_agendadas(self, request):
        qs = self.queryset.using('read_only').filter(fecha_entrega_pactada_cotizacion__isnull=False,
                                                     estado__in=['Cita/Generación Interés', 'Configurando Propuesta'])
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_cotizaciones_tuberia_ventas(self, request):
        self.queryset = Cotizacion.objects.using('read_only').select_related(
            'cliente',
            'contacto_cliente',
            'cotizacion_inicial__cliente',
            'cotizacion_inicial__contacto_cliente',
            'responsable'
        ).annotate(
            nro_pagos_proyectados=Count('pagos_proyectados')
        )
        self.serializer_class = CotizacionTuberiaVentaSerializer
        qs = self.queryset.using('read_only').annotate(
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
                    Q(nro_pagos_proyectados=0)
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
        _ordenes_compra = CotizacionPagoProyectado.objects.using('read_only').values('cotizacion_id').annotate(
            valor_oc=Sum('valor_orden_compra')
        ).filter(
            cotizacion_id=OuterRef('id'),
            cotizacion__estado='Cierre (Aprobado)',
            orden_compra_fecha__year=year,
            orden_compra_fecha__month=month
        ).distinct()

        qsBase = Cotizacion.objects.using('read_only').select_related(
            'cliente',
            'contacto_cliente',
            'cotizacion_inicial__cliente',
            'cotizacion_inicial__contacto_cliente',
            'responsable'
        ).annotate(
            valor_orden_compra_mes=ExpressionWrapper(
                Subquery(_ordenes_compra.values('valor_oc')),
                output_field=DecimalField(max_digits=12, decimal_places=4)
            )
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
                valor_orden_compra_trimestre=ExpressionWrapper(
                    Subquery(_ordenes_compra_trimestre.values('valor_oc')),
                    output_field=DecimalField(max_digits=12, decimal_places=4)
                )
            )
            qs3 = qsBase.filter(
                estado__in=[
                    'Cita/Generación Interés',
                    'Configurando Propuesta',
                    'Cotización Enviada',
                    'Evaluación Técnica y Económica',
                    'Aceptación de Terminos y Condiciones',
                    'Aplazado',
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

    # endregion

    # region Detail Actions
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

    @action(detail=True, methods=['post'])
    def upload_archivo(self, request, pk=None):
        nombre_archivo = self.request.POST.get('nombre')
        tipo = self.request.POST.get('tipo')
        self.queryset = Cotizacion.base.detalle_cotizacion()
        self.serializer_class = CotizacionConDetalleSerializer
        from .services import cotizacion_upload_documento
        cotizacion_upload_documento(
            cotizacion_id=pk,
            user_id=self.request.user.id,
            nombre_archivo=nombre_archivo,
            archivo=self.request.FILES['archivo'],
            tipo=tipo
        )
        serializer = self.get_serializer(self.get_object())
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
        self.queryset = Cotizacion.base.detalle_cotizacion()
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

    @transaction.non_atomic_requests
    @action(detail=True, methods=['post'])
    def adicionar_pago_proyectado_desde_vieja(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = Cotizacion.base.detalle_cotizacion()
        orden_compra_anterior_id = request.POST.get('orden_compra_anterior_id', None)
        pago_proyectado_anterior = CotizacionPagoProyectado.objects.get(pk=orden_compra_anterior_id)
        if not (
                pago_proyectado_anterior.orden_compra_documento and pago_proyectado_anterior.orden_compra_documento.archivo):
            orden_compra_archivo = request.FILES.get('orden_compra_archivo')
        else:
            orden_compra_archivo = pago_proyectado_anterior.orden_compra_documento.archivo
        orden_compra_fecha = request.POST.get('orden_compra_fecha', None)
        valor_orden_compra = request.POST.get('valor_orden_compra', None)
        orden_compra_nro = request.POST.get('orden_compra_nro', None)
        plan_pago = request.POST.get('plan_pago', None)
        from .services import cotizacion_add_pago_proyectado

        try:
            with transaction.atomic():
                pago_proyectado = cotizacion_add_pago_proyectado(
                    cotizacion_id=pk,
                    orden_compra_fecha=orden_compra_fecha,
                    orden_compra_nro=orden_compra_nro,
                    valor_orden_compra=valor_orden_compra,
                    orden_compra_archivo=orden_compra_archivo,
                    user_id=self.request.user.id,
                    no_enviar_correo=True
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
                        porcentaje=acuerdos_de_pago[pp].get('porcentaje'),
                        requisitos=acuerdos_de_pago[pp].get('requisitos')
                    )

                pago_proyectado_anterior.orden_compra_documento.delete() if pago_proyectado_anterior.orden_compra_documento else None,
                CotizacionPagoProyectadoAcuerdoPago.objects.filter(
                    orden_compra_id=pago_proyectado_anterior.id).delete(),
                pago_proyectado_anterior.delete()
        except Exception as e:
            raise ValidationError({'_error': e})
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_pago_proyectado(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = Cotizacion.base.detalle_cotizacion()
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
                porcentaje=acuerdos_de_pago[pp].get('porcentaje'),
                requisitos=acuerdos_de_pago[pp].get('requisitos')
            )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_pago(self, request, pk=None):
        self.serializer_class = CotizacionConDetalleSerializer
        self.queryset = Cotizacion.base.detalle_cotizacion()
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
        self.queryset = Cotizacion.base.detalle_cotizacion()
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
        self.queryset = Cotizacion.base.detalle_cotizacion()
        from .services import cotizacion_eliminar_pago_proyectado
        cotizacion_eliminar_pago_proyectado(
            cotizacion_id=pk,
            pago_proyectado_id=orden_compra_id,
            user_id=self.request.user.id
        )
        serializer = self.get_serializer(self.get_object())
        return Response(serializer.data)

    # endregion


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
        qs = self.queryset.using('read_only').filter(cotizacion_id=cotizacion_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_tareas_pendientes(self, request):
        qs = SeguimientoCotizacion.objects.using('read_only').filter(
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
            archivo_cotizacion_id=self.get_object().id,
            user_id=self.request.user.id
        )
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    def update(self, request, *args, **kwargs):
        archivo: ArchivoCotizacion = self.get_object()
        if archivo.tipo in ['ORDENCOMPRA', 'COTIZACION']:
            raise ValidationError(
                {'_error': 'Los documentos de tipo %s no se pueden modificar.' % archivo.get_tipo_display()})
        return super().update(request, *args, **kwargs)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_cotizacion(self, request):
        cotizacion_id = request.GET.get('cotizacion_id')
        qs = self.queryset.using('read_only').filter(cotizacion_id=cotizacion_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class CotizacionPagoProyectadoAcuerdoPagoViewSet(viewsets.ModelViewSet):
    queryset = CotizacionPagoProyectadoAcuerdoPago.objects.all()
    serializer_class = CotizacionPagoProyectadoAcuerdoPagoSerializer

    @action(detail=False, http_method_names=['get', ])
    def acuerdos_pago_cotizacion_informe_gerencial(self, request):
        lista = CotizacionPagoProyectadoAcuerdoPago.objects.using('read_only').select_related(
            'orden_compra',
            'orden_compra__cotizacion',
            'orden_compra__cotizacion__cliente',
            'orden_compra__cotizacion__responsable',
        ).prefetch_related(
            'orden_compra__cotizacion__proyectos'
        ).annotate(
            recaudo=Sum('pagos__valor')
        ).exclude(
            motivo="MIGRADO"
        ).filter(
            Q(orden_compra__cotizacion__estado='Cierre (Aprobado)') &
            (Q(valor_proyectado__gt=0) | Q(recaudo__gt=0)) &
            Q(fecha_proyectada__isnull=False)
        )
        self.serializer_class = CotizacionPagoProyectadoAcuerdoPagoInformeGerenciaSerializer
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class CotizacionPagoProyectadoViewSet(viewsets.ModelViewSet):
    queryset = CotizacionPagoProyectado.objects.all()
    serializer_class = CotizacionPagoProyectadoInformeGerencialSerializer

    @action(detail=False, http_method_names=['get', ])
    def ordenes_compra_cotizacion_informe_gerencial(self, request):
        months = self.request.GET.get('months').split(',')
        years = self.request.GET.get('years').split(',')
        lista = CotizacionPagoProyectado.objects.using('read_only').prefetch_related(
            'cotizacion',
            'cotizacion__responsable',
            'cotizacion__cliente',
        ).filter(
            orden_compra_fecha__year__in=years,
            orden_compra_fecha__month__in=months,
            cotizacion__estado='Cierre (Aprobado)'
        )
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
