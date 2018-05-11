from django.db.models import ExpressionWrapper, OuterRef, Subquery, DecimalField, Sum, F
from django.db.models.functions import Coalesce
from django.views.generic import DetailView

# from ordenes.mixins import OrdenesPDFMixin
from .models import Proyecto, Literal
from cguno.models import ItemsLiteralBiable
from mano_obra.models import HoraHojaTrabajo


class ReporteCostosProyectoView(DetailView):
    model = Proyecto
    template_name = 'reportes/proyectos/costos.html'
    context_object_name = 'proyecto'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        proyecto = self.object

        fecha = '2017-11-30'

        mano_obra = HoraHojaTrabajo.objects.values('literal').annotate(
            costo_total=ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60) * (
                        F('hoja__tasa__costo') / F('hoja__tasa__nro_horas_mes_trabajadas'))),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal_id=OuterRef('id'),
            hoja__fecha__lte=fecha
        )

        materiales = ItemsLiteralBiable.objects.values('literal').annotate(
            costo_total=Sum('costo_total')
        ).filter(
            literal_id=OuterRef('id'),
            lapso__lte=fecha
        )

        qsLiterales = Literal.objects.filter(
            proyecto=proyecto
        ).annotate(
            costo_mano_obra=ExpressionWrapper(
                Subquery(mano_obra.values('costo_total')),
                output_field=DecimalField(max_digits=4)
            ),
            costo_mis_materiales=
            Coalesce(
                ExpressionWrapper(
                    Subquery(materiales.values('costo_total')),
                    output_field=DecimalField(max_digits=4)
                ),
                0)
        ).distinct()

        total_costo_mo = 0
        for literal in qsLiterales:
            if literal.costo_mano_obra:
                total_costo_mo += literal.costo_mano_obra

        total_costo_materiales = qsLiterales.aggregate(Sum('costo_mis_materiales'))['costo_mis_materiales__sum']

        context['literales'] = qsLiterales
        context['total_costo_mo'] = total_costo_mo
        context['total_costo_materiales'] = total_costo_materiales
        context['total_costo'] = total_costo_mo + total_costo_materiales
        # context['orden'] = orden
        # context['entidad'] = orden.entidad
        # context['medico_remitente'] = orden.medico_remitente
        #
        # context = self.generar_resultados(orden, context)

        return context
