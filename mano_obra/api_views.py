import math

from django.db.models import Sum, Value as V, F, ExpressionWrapper, DecimalField
from django.db.models.functions import Coalesce
from rest_framework import viewsets, serializers
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
                F('tasa__costo') / F('tasa__nro_horas_mes_trabajadas')), output_field=DecimalField(max_digits=4)),
        cantidad_horas=ExpressionWrapper((Coalesce(Sum('mis_horas_trabajadas__cantidad_minutos'), V(0)) / 60),
                                         output_field=DecimalField(max_digits=4))
    ).all()
    serializer_class = HojaTrabajoDiarioSerializer

    def perform_create(self, serializer):
        instance = serializer.save(creado_por=self.request.user)
        colaborador = instance.colaborador
        object, created = ColaboradorCostoMesBiable.objects.get_or_create(
            lapso=instance.fecha.replace(day=1),
            colaborador=colaborador
        )
        instance.tasa = object
        if created:
            campos_tasas = colaborador._meta.get_fields()
            for i in campos_tasas:
                if hasattr(object, i.name) and i.name not in ['mis_dias_trabajados', 'id', 'colaborador']:
                    valor = getattr(colaborador, i.name)
                    setattr(object, i.name, valor)
            object.save()
            object.calcular_costo_total()

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
        'hoja__tasa',
        'hoja__tasa__centro_costo',
        'creado_por'
    ).all()
    serializer_class = HoraHojaTrabajoSerializer

    def perform_destroy(self, instance):
        if not instance.verificado or (not instance.autogestionada and instance.verificado):
            tasa = instance.hoja.tasa
            tasa.nro_horas_mes_trabajadas -= int(math.ceil(instance.cantidad_minutos / 60))
            tasa.nro_horas_mes_trabajadas = max(tasa.nro_horas_mes_trabajadas, 0)
            tasa.save()
            super().perform_destroy(instance)
        else:
            content = {'error': ['No se puede eliminar, ya se encuentra verificado']}
            raise serializers.ValidationError(content)

    def ajusta_horas(self, instance):
        tasa = instance.hoja.tasa
        es_salario_fijo = instance.hoja.tasa.es_salario_fijo
        nro_horas_contrato = instance.hoja.colaborador.nro_horas_mes
        horas_trabajadas = nro_horas_contrato
        if es_salario_fijo:
            horas = HoraHojaTrabajo.objects.filter(
                hoja__tasa__lapso=instance.hoja.tasa.lapso,
                hoja__colaborador=instance.hoja.colaborador
            ).aggregate(horas=ExpressionWrapper(Sum('cantidad_minutos') / 60, output_field=DecimalField(max_digits=4)))[
                'horas']
            if horas > nro_horas_contrato:
                horas_trabajadas = horas
        tasa.nro_horas_mes_trabajadas = horas_trabajadas
        tasa.save()

    def perform_create(self, serializer):
        instance = serializer.save(creado_por=self.request.user)
        self.ajusta_horas(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        self.ajusta_horas(instance)

    @list_route(http_method_names=['get', ])
    def horas_por_hoja_trabajo(self, request):
        hoja_id = request.GET.get('hoja_id')
        lista = self.queryset.filter(hoja_id=hoja_id).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def horas_por_literal(self, request):
        literal_id = request.GET.get('literal_id')
        lista = self.queryset.filter(literal_id=literal_id).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def autogestionadas_x_fechas(self, request):
        fecha_inicial = request.GET.get('fecha_inicial')
        fecha_final = request.GET.get('fecha_final')
        lista = self.queryset.filter(autogestionada=True).all()
        if fecha_inicial and fecha_final:
            lista = lista.filter(hoja__fecha__gte=fecha_inicial, hoja__fecha__lte=fecha_final)
        else:
            lista = lista.filter(verificado=False)
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
