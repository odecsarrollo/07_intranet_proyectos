from django.utils.dateparse import parse_date
from io import BytesIO

from django.db.models import Sum, F, ExpressionWrapper, DecimalField, OuterRef, Subquery, Count
from django.db.models.expressions import Exists
from django.db.models.functions import Coalesce
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import Proyecto, Literal
from .api_serializers import ProyectoSerializer, LiteralSerializer
from mano_obra.models import HoraHojaTrabajo, HoraTrabajoColaboradorLiteralInicial
from .mixins import LiteralesPDFMixin


class ProyectoViewSet(LiteralesPDFMixin, viewsets.ModelViewSet):
    queryset = Proyecto.objects.select_related(
        'cliente',
        'cotizacion',
        'cotizacion__cliente',
    ).all()
    serializer_class = ProyectoSerializer

    def get_queryset(self):
        mano_obra = HoraHojaTrabajo.objects.values('literal__proyecto__id_proyecto').annotate(
            cantidad_horas=ExpressionWrapper(Sum((F('cantidad_minutos') / 60)),
                                             output_field=DecimalField(max_digits=4)),
            costo_total=ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60) * (
                        (F('hoja__tasa__costo') + F('hoja__tasa__otro_costo')) / F(
                    'hoja__tasa__nro_horas_mes_trabajadas'))),
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

    @list_route(methods=['get'])
    def print_costos(self, request, pk=None):
        id_proyecto = request.GET.get('id_proyecto', None)
        fecha_inicial = request.GET.get('fecha_inicial', None)
        fecha_final = request.GET.get('fecha_final', None)
        con_mo_saldo_inicial = request.GET.get('con_mo_saldo_inicial', None)

        if not fecha_final or not fecha_inicial:
            con_mo_saldo_inicial = True
        elif con_mo_saldo_inicial == 'false':
            con_mo_saldo_inicial = False
        elif con_mo_saldo_inicial == 'true':
            con_mo_saldo_inicial = True
        else:
            con_mo_saldo_inicial = False

        proyecto = Proyecto.objects.filter(id_proyecto=id_proyecto).first()
        main_doc = self.generar_pdf(self.request, fecha_inicial, fecha_final, con_mo_saldo_inicial, proyecto)
        output = BytesIO()
        main_doc.write_pdf(
            target=output
        )
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        response.write(output.getvalue())
        output.close()
        return response


class LiteralViewSet(viewsets.ModelViewSet):
    queryset = Literal.objects.select_related(
        'proyecto',
        'proyecto__cotizacion__cliente',
        'cotizacion',
    ).all()
    serializer_class = LiteralSerializer

    def get_queryset(self):
        mano_obra = HoraHojaTrabajo.objects.values('literal').annotate(
            cantidad_horas=ExpressionWrapper(Sum((F('cantidad_minutos') / 60)),
                                             output_field=DecimalField(max_digits=4)),
            costo_total=ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60) * (
                        (F('hoja__tasa__costo') + F('hoja__tasa__otro_costo')) / F(
                    'hoja__tasa__nro_horas_mes_trabajadas'))),
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

    @list_route(http_method_names=['get', ])
    def sin_sincronizar(self, request):
        lista = self.get_queryset().filter(en_cguno=False).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)
