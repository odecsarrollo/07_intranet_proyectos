import json

from django.utils.timezone import datetime
from django.db.models import (
    Count,
    Max,
    OuterRef,
    Subquery,
    ExpressionWrapper,
    IntegerField,
    Q,
    Case,
    When,
    BooleanField
)
from django.db.models.functions import Coalesce
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.decorators import list_route, detail_route

from .models import Fase, FaseLiteral, TareaFase
from .api_serializers import FaseLiteralSerializer, FaseSerializer, TareaFaseSerializer


class FaseViewSet(viewsets.ModelViewSet):
    queryset = Fase.objects.all()
    serializer_class = FaseSerializer


class TareaFaseViewSet(viewsets.ModelViewSet):
    queryset = TareaFase.objects.select_related(
        'fase_literal',
        'fase_literal__literal'
    ).all()
    serializer_class = TareaFaseSerializer

    @list_route(http_method_names=['get', ])
    def por_fase_literal(self, request):
        id_fase_literal = self.request.GET.get('id_fase_literal')
        lista = self.get_queryset().filter(fase_literal_id=id_fase_literal).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def pendientes(self, request):
        usuario = self.request.user
        lista = self.get_queryset().annotate(
            soy_asignado=Case(
                When(asignado_a=usuario, then=True),
                default=False,
                output_field=BooleanField()
            ),
            soy_responsable=Case(
                When(fase_literal__responsable=usuario, then=True),
                default=False,
                output_field=BooleanField()
            ),
        ).filter(
            Q(asignado_a=usuario) |
            Q(fase_literal__responsable=usuario)
        ).exclude(estado=4)
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def terminadas(self, request):
        usuario = self.request.user
        lista = self.get_queryset().annotate(
            soy_asignado=Case(
                When(asignado_a=usuario, then=True),
                default=False,
                output_field=BooleanField()
            ),
            soy_responsable=Case(
                When(fase_literal__responsable=usuario, then=True),
                default=False,
                output_field=BooleanField()
            ),
        ).filter(
            (
                    Q(asignado_a=usuario) |
                    Q(fase_literal__responsable=usuario)
            ) &
            Q(estado=4)
        )
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class FaseLiteralViewSet(viewsets.ModelViewSet):
    queryset = FaseLiteral.objects.select_related(
        'fase',
        'responsable',
        'responsable__colaborador',
    ).all()
    serializer_class = FaseLiteralSerializer

    @detail_route(methods=['post'])
    def eliminar_tareas(self, request, pk=None):
        listado_tareas = json.loads(request.POST.get('listado'))
        fase_literal = self.get_object()
        fase_literal.tareas.filter(id__in=listado_tareas).delete()
        serializer = self.get_serializer(fase_literal)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def cargar_tareas(self, request, pk=None):
        listado_tareas = json.loads(request.POST.get('listado'))
        listado_tareas.pop(0)
        fase_literal = self.get_object()
        for linea in listado_tareas:
            ano = int(linea.pop('ano'))
            mes = int(linea.pop('mes'))
            dia = int(linea.pop('dia'))
            TareaFase.objects.create(
                # creado_por=self.request.user,
                fase_literal=fase_literal,
                fecha_limite=datetime(ano, mes, dia),
                **linea
            )
        serializer = self.get_serializer(fase_literal)
        return Response(serializer.data)

    def get_queryset(self):
        tareas_terminadas = TareaFase.objects.select_related(
            'asignado_a',
            'asignado_a__colaborador'
        ).values(
            'fase_literal',
        ).annotate(
            nro_tareas_terminadas=Count('id')
        ).filter(
            fase_literal=OuterRef('id'),
            estado=4
        )
        tareas_vencidas = TareaFase.objects.values(
            'fase_literal'
        ).annotate(
            nro_tareas_vencidas=Count('id')
        ).filter(
            fase_literal=OuterRef('id'),
            fecha_limite__lte=datetime.now()
        ).exclude(
            estado=4
        )
        qs = super().get_queryset().annotate(
            nro_tareas=Count('tareas'),
            nro_tareas_terminadas=Coalesce(
                ExpressionWrapper(
                    Subquery(tareas_terminadas.values('nro_tareas_terminadas')),
                    output_field=IntegerField()
                ), 0
            ),
            nro_tareas_vencidas=Coalesce(
                ExpressionWrapper(
                    Subquery(tareas_vencidas.values('nro_tareas_vencidas')),
                    output_field=IntegerField()
                ), 0
            ),
            fecha_limite=Max('tareas__fecha_limite'),
        )
        return qs

    @list_route(http_method_names=['get', ])
    def por_literal(self, request):
        id_literal = self.request.GET.get('id_literal')
        lista = self.get_queryset().filter(literal_id=id_literal).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
