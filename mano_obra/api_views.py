import datetime

from django.db.models import Sum, Value as V, F, ExpressionWrapper, DecimalField
from django.db.models.functions import Coalesce
from rest_framework import viewsets, serializers, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import HoraHojaTrabajo, HojaTrabajoDiario
from .api_serializers import HoraHojaTrabajoSerializer, HojaTrabajoDiarioSerializer

from cguno.models import ColaboradorCostoMesBiable


class HojaTrabajoDiarioViewSet(viewsets.ModelViewSet):
    queryset = HojaTrabajoDiario.objects.select_related(
        'tasa',
        'colaborador',
    ).prefetch_related(
        'mis_horas_trabajadas',
        'mis_horas_trabajadas__literal',
        'mis_horas_trabajadas__literal__proyecto',
    ).annotate(
        costo_total=ExpressionWrapper((Coalesce(Sum('mis_horas_trabajadas__cantidad_minutos'), V(0)) / 60) * (
                F('tasa__costo') / F('tasa__nro_horas_mes')), output_field=DecimalField(max_digits=4)),
        cantidad_horas=ExpressionWrapper((Coalesce(Sum('mis_horas_trabajadas__cantidad_minutos'), V(0)) / 60),
                                         output_field=DecimalField(max_digits=4))
    ).all()
    serializer_class = HojaTrabajoDiarioSerializer

    def perform_create(self, serializer):
        instance = serializer.save(creado_por=self.request.user)
        object, created = ColaboradorCostoMesBiable.objects.get_or_create(
            lapso=instance.fecha.replace(day=1),
            colaborador=instance.colaborador
        )
        instance.tasa = object
        instance.save()

    @list_route(http_method_names=['get', ])
    def listar_x_fechas(self, request):
        fecha_inicial = request.GET.get('fecha_inicial')
        fecha_final = request.GET.get('fecha_final')
        qs = None

        gestiona_otros = request.user.has_perm('HojaTrabajoDiario.para_otros_hojatrabajodiario')

        if gestiona_otros:
            qs = self.queryset
        else:
            if hasattr(request.user, 'colaborador') and not gestiona_otros:
                colaborador = request.user.colaborador
                if colaborador.en_proyectos and colaborador.autogestion_horas_trabajadas:
                    qs = self.queryset.filter(colaborador=colaborador)

        if fecha_final and fecha_final and qs:
            qs = qs.filter(fecha__gte=fecha_inicial, fecha__lte=fecha_final)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class HoraHojaTrabajoViewSet(viewsets.ModelViewSet):
    queryset = HoraHojaTrabajo.objects.select_related(
        'literal',
        'literal__proyecto',
        'hoja',
        'hoja__colaborador',
        'hoja__tasa'
    ).all()
    serializer_class = HoraHojaTrabajoSerializer

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @list_route(http_method_names=['get', ])
    def horas_por_hoja_trabajo(self, request):
        hoja_id = request.GET.get('hoja_id')
        lista = self.queryset.filter(hoja_id=hoja_id).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
