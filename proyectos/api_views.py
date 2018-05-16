from django.db.models import Sum, Value as V, F, ExpressionWrapper, DecimalField, OuterRef, Subquery, Count
from django.db.models.expressions import RawSQL, Exists
from django.db.models.functions import Coalesce
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import Proyecto, Literal
from .api_serializers import ProyectoSerializer, LiteralSerializer
from mano_obra.models import HoraHojaTrabajo, HoraTrabajoColaboradorLiteralInicial


class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.select_related(
        'cliente',
        'cotizacion'
    ).all()
    serializer_class = ProyectoSerializer

    def get_queryset(self):
        mano_obra = HoraHojaTrabajo.objects.values('literal__proyecto__id_proyecto').annotate(
            cantidad_horas=ExpressionWrapper(Sum((F('cantidad_minutos') / 60)),
                                             output_field=DecimalField(max_digits=4)),
            costo_total=ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60) * (
                        F('hoja__tasa__costo') / F('hoja__tasa__nro_horas_mes_trabajadas'))),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal__proyecto__id_proyecto=OuterRef('id_proyecto'),
            verificado=True
        )

        mano_obra_inicial = HoraTrabajoColaboradorLiteralInicial.objects.values(
            'literal__proyecto__id_proyecto').annotate(
            cantidad_horas=
            ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60)),
                output_field=DecimalField(max_digits=4)
            ),
            costo_total=
            ExpressionWrapper(
                Sum('valor'),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal__proyecto__id_proyecto=OuterRef('id_proyecto')
        )

        qs = Proyecto.objects.prefetch_related(
            'mis_literales'
        ).annotate(
            costo_mano_obra=Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra.values('costo_total')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            costo_mano_obra_inicial=Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra_inicial.values('costo_total')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            cantidad_horas_mano_obra=Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra.values('cantidad_horas')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            cantidad_horas_mano_obra_inicial=Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra_inicial.values('cantidad_horas')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            )
        )
        return qs

    @list_route(http_method_names=['get', ])
    def abiertos(self, request):
        lista = self.get_queryset().filter(abierto=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def con_literales_abiertos(self, request):
        lista = self.get_queryset().filter(abierto=True, mis_literales__abierto=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


class LiteralViewSet(viewsets.ModelViewSet):
    queryset = Literal.objects.select_related(
        'proyecto',
        'proyecto__cliente'
    ).all()
    serializer_class = LiteralSerializer

    def get_queryset(self):
        mano_obra = HoraHojaTrabajo.objects.values('literal').annotate(
            cantidad_horas=ExpressionWrapper(Sum((F('cantidad_minutos') / 60)),
                                             output_field=DecimalField(max_digits=4)),
            costo_total=ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60) * (
                        F('hoja__tasa__costo') / F('hoja__tasa__nro_horas_mes_trabajadas'))),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal_id=OuterRef('id'),
            verificado=True
        )
        mano_obra_inicial = HoraTrabajoColaboradorLiteralInicial.objects.values('literal').annotate(
            cantidad_horas=ExpressionWrapper(Sum((F('cantidad_minutos') / 60)),
                                             output_field=DecimalField(max_digits=4)),
            costo_total=ExpressionWrapper(
                Sum('valor'),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal_id=OuterRef('id')
        )

        qs = Literal.objects.select_related(
            'proyecto'
        ).annotate(
            costo_mano_obra=
            Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra.values('costo_total')),
                    output_field=DecimalField(max_digits=4)
                ),
                0
            ),
            costo_mano_obra_inicial=
            Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra_inicial.values('costo_total')),
                    output_field=DecimalField(max_digits=4)
                ),
                0
            ),
            cantidad_horas_mano_obra=
            Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra.values('cantidad_horas')),
                    output_field=DecimalField(max_digits=4)
                ),
                0
            ),
            cantidad_horas_mano_obra_inicial=
            Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra_inicial.values('cantidad_horas')),
                    output_field=DecimalField(max_digits=4)
                ),
                0
            ),
        )
        return qs

    @list_route(http_method_names=['get', ])
    def abiertos(self, request):
        lista = self.get_queryset().filter(abierto=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def proyecto_abierto(self, request):
        literales_abiertos = Literal.objects.filter(
            proyecto_id=OuterRef('proyecto_id'),
            abierto=True
        )
        lista = self.get_queryset().annotate(
            proyecto_con_literales_abierto=Exists(literales_abiertos)
        ).filter(
            proyecto__abierto=True,
            proyecto_con_literales_abierto=True
        ).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @list_route(http_method_names=['get', ])
    def listar_x_proyecto(self, request):
        proyecto_id = request.GET.get('proyecto_id')
        qs = None
        if proyecto_id:
            qs = self.get_queryset().filter(proyecto_id=proyecto_id)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
