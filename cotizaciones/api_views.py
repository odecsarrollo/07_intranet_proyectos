import datetime
from math import ceil
from django.db.models import Max, Q
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import Cotizacion, SeguimientoCotizacion
from .api_serializers import CotizacionSerializer, SeguimientoCotizacionSerializer


class CotizacionViewSet(viewsets.ModelViewSet):
    queryset = Cotizacion.objects.select_related(
        'responsable',
        'created_by',
        'cliente',
        'mi_proyecto',
        'mi_literal',
        'contacto_cliente'
    ).all()
    serializer_class = CotizacionSerializer

    def perform_update(self, serializer):
        old_obj = self.get_object()
        editado = serializer.save()
        guardar_nuevamente = False
        if editado.fecha_limite_segumiento_estado:
            editado.fecha_limite_segumiento_estado = editado.fecha_limite_segumiento_estado.date()
        if old_obj.estado != editado.estado:
            editado.fecha_cambio_estado = datetime.datetime.now().date()
            guardar_nuevamente = True

        if editado.estado != old_obj.estado:
            SeguimientoCotizacion.objects.create(
                cotizacion=editado,
                tipo_seguimiento=1,
                creado_por=self.request.user,
                estado=editado.estado
            )

        if editado.abrir_carpeta != old_obj.abrir_carpeta:
            if editado.abrir_carpeta == True:
                estado = 'Solicitó Abrir Carpeta'
            elif editado.abrir_carpeta == False:
                estado = 'Canceló Abrir Carpeta'
            SeguimientoCotizacion.objects.create(
                cotizacion=editado,
                tipo_seguimiento=1,
                creado_por=self.request.user,
                estado=estado
            )
            guardar_nuevamente = True

        if editado.estado not in ['Aplazado', 'Cancelado', 'Cita/Generación Interés']:
            if editado.estado == 'Cierre (Aprobado)':
                if not editado.fecha_cambio_estado_cerrado:
                    editado.fecha_cambio_estado_cerrado = datetime.datetime.now()
            else:
                editado.fecha_cambio_estado_cerrado = None

            if editado.nro_cotizacion is None:
                now = datetime.datetime.now()
                base_nro_cotizacion = (abs(int(now.year)) % 100) * 1000
                qs = Cotizacion.objects.filter(
                    nro_cotizacion__isnull=False,
                    nro_cotizacion__gte=base_nro_cotizacion
                ).aggregate(
                    ultimo_indice=Max('nro_cotizacion')
                )
                ultimo_indice = qs['ultimo_indice']
                if ultimo_indice is None:
                    editado.nro_cotizacion = base_nro_cotizacion
                else:
                    editado.nro_cotizacion = int(ultimo_indice) + 1
                guardar_nuevamente = True
        if guardar_nuevamente:
            editado.save()

    def perform_create(self, serializer):
        editado = serializer.save(
            estado='Cita/Generación Interés',
            created_by=self.request.user,
            fecha_cambio_estado=datetime.datetime.now().date(),
            responsable=self.request.user,
        )
        if editado.fecha_limite_segumiento_estado:
            editado.fecha_limite_segumiento_estado = editado.fecha_limite_segumiento_estado.date()
        SeguimientoCotizacion.objects.create(
            cotizacion=editado,
            tipo_seguimiento=1,
            creado_por=self.request.user,
            estado=editado.estado
        )

    @list_route(http_method_names=['get', ])
    def listar_cotizacion_abrir_carpeta(self, request):
        qs = self.get_queryset().filter(
            (
                    Q(abrir_carpeta=True) &
                    Q(mi_proyecto__isnull=True)
            ) |
            (
                    Q(crear_literal=True) &
                    Q(mi_literal__isnull=True)
            )
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def listar_cotizaciones_agendadas(self, request):
        qs = self.get_queryset().filter(fecha_entrega_pactada_cotizacion__isnull=False,
                                        estado__in=['Cita/Generación Interés', 'Configurando Propuesta'])
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def listar_cotizaciones_tuberia_ventas(self, request):
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
                    Q(fecha_cambio_estado__year=year) &
                    Q(fecha_cambio_estado__month=month)
            )
        )
        if not self.request.user.has_perm('cotizaciones.list_all_cotizaciones_activas'):
            qs = qs.filter(responsable=self.request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def cotizaciones_resumen_tuberia_ventas(self, request):
        year = request.GET.get('ano', datetime.datetime.now().year)
        current_date = datetime.datetime.now()
        current_quarter = request.GET.get('trimestre', ceil(current_date.month / 3))
        qs = self.get_queryset().filter(
            estado__in=[
                'Cita/Generación Interés',
                'Configurando Propuesta',
                'Cotización Enviada',
                'Evaluación Técnica y Económica',
                'Aceptación de Terminos y Condiciones',
            ]
        )
        qs = qs | self.get_queryset().filter(
            estado='Cierre (Aprobado)',
            fecha_cambio_estado_cerrado__year=year,
            fecha_cambio_estado_cerrado__quarter=current_quarter
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class SeguimientoCotizacionViewSet(viewsets.ModelViewSet):
    queryset = SeguimientoCotizacion.objects.select_related('creado_por', 'cotizacion__cliente').all()
    serializer_class = SeguimientoCotizacionSerializer

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @list_route(http_method_names=['get', ])
    def listar_x_cotizacion(self, request):
        cotizacion_id = request.GET.get('cotizacion_id')
        qs = self.get_queryset().filter(cotizacion_id=cotizacion_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
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
