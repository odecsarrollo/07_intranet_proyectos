from rest_framework import viewsets, serializers, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import TasaHora, HoraHojaTrabajo, HojaTrabajoDiario
from .api_serializers import TasaHoraSerializer, HoraHojaTrabajoSerializer, HojaTrabajoDiarioSerializer
from proyectos.models import Literal, Proyecto


class TasaHoraViewSet(viewsets.ModelViewSet):
    queryset = TasaHora.objects.select_related('colaborador').all()
    serializer_class = TasaHoraSerializer

    def perform_update(self, serializer):
        instance = serializer.save()
        hojas_trabajos_diarios = instance.mis_dias_trabajados.all()
        literales = Literal.objects.filter(mis_horas_trabajadas__hoja__tasa=instance).distinct()
        proyectos = Proyecto.objects.filter(mis_literales__mis_horas_trabajadas__hoja__tasa=instance).distinct()

        [x.actualizar_minutos() for x in hojas_trabajos_diarios.all()]
        [x.actualizar_costos_mano_obra() for x in literales.all()]
        [x.actualizar_costos_mano_obra() for x in proyectos.all()]


class HojaTrabajoDiarioViewSet(viewsets.ModelViewSet):
    queryset = HojaTrabajoDiario.objects.select_related('tasa', 'colaborador').all()
    serializer_class = HojaTrabajoDiarioSerializer

    def perform_create(self, serializer):
        instance = serializer.save(creado_por=self.request.user)
        object, created = TasaHora.objects.get_or_create(
            ano=instance.fecha.year,
            mes=instance.fecha.month,
            colaborador=instance.colaborador
        )
        instance.tasa = object
        instance.save()


class HoraHojaTrabajoViewSet(viewsets.ModelViewSet):
    queryset = HoraHojaTrabajo.objects.select_related('literal', 'literal__proyecto').all()
    serializer_class = HoraHojaTrabajoSerializer

    def perform_create(self, serializer):
        instance = serializer.save(creado_por=self.request.user)
        instance.hoja.actualizar_minutos()
        instance.literal.actualizar_costos_mano_obra()
        instance.literal.proyecto.actualizar_costos_mano_obra()

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.hoja.actualizar_minutos()
        instance.literal.actualizar_costos_mano_obra()
        instance.literal.proyecto.actualizar_costos_mano_obra()

    def perform_destroy(self, instance):
        hoja = instance.hoja
        super().perform_destroy(instance)
        hoja.actualizar_minutos()
        instance.literal.actualizar_costos_mano_obra()
        instance.literal.proyecto.actualizar_costos_mano_obra()

    @list_route(http_method_names=['get', ])
    def horas_por_hoja_trabajo(self, request):
        hoja_id = request.GET.get('hoja_id')
        lista = self.queryset.filter(hoja_id=hoja_id).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
