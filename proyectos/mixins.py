from django.db.models import ExpressionWrapper, OuterRef, Subquery, DecimalField, Sum, F
from django.db.models.functions import Coalesce

from django.template.loader import get_template
from weasyprint import HTML, CSS

from .models import Proyecto, Literal
from cguno.models import ItemsLiteralBiable
from mano_obra.models import HoraHojaTrabajo


def get_page_body(boxes):
    for box in boxes:
        if box.element_tag == 'body':
            return box
        return get_page_body(box.all_children())


class LiteralesPDFMixin(object):
    def generar_resultados(self, fecha_inicial, fecha_final, con_mo_saldo_inicial, proyecto):
        context = {}
        mano_obra = HoraHojaTrabajo.objects.values('literal').annotate(
            costo_total=ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60) * (
                        F('hoja__tasa__costo') / F('hoja__tasa__nro_horas_mes_trabajadas'))),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal_id=OuterRef('id')
        )

        materiales = ItemsLiteralBiable.objects.values('literal').annotate(
            costo_total=Sum('costo_total')
        ).filter(
            literal_id=OuterRef('id')
        )

        if fecha_inicial and fecha_final:
            materiales = materiales.filter(
                lapso__lte=fecha_final,
                lapso__gte=fecha_inicial
            )
            mano_obra = mano_obra.filter(
                hoja__fecha__lte=fecha_final,
                hoja__fecha__gte=fecha_inicial
            )

        qsLiterales = Literal.objects.filter(
            proyecto=proyecto
        ).annotate(
            costo_mano_obra_iniciales=Sum('mis_horas_trabajadas_iniciales__valor'),
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
        total_costo_mo_ini = 0

        for literal in qsLiterales:
            if literal.costo_mano_obra:
                total_costo_mo += literal.costo_mano_obra
            if literal.costo_mano_obra_iniciales and con_mo_saldo_inicial:
                total_costo_mo_ini += literal.costo_mano_obra_iniciales

        total_costo_materiales = qsLiterales.aggregate(Sum('costo_mis_materiales'))['costo_mis_materiales__sum']

        context['tipo_consulta'] = 'Todo'
        if fecha_inicial and fecha_final:
            context['tipo_consulta'] = 'por lapso'
            context['fecha_inicial'] = fecha_inicial
            context['fecha_final'] = fecha_final
        context['literales'] = qsLiterales
        context['proyecto'] = proyecto
        context['con_mo_saldo_inicial'] = con_mo_saldo_inicial
        context['total_costo_mo'] = total_costo_mo
        context['total_costo_mo_ini'] = total_costo_mo_ini
        context['total_costo_materiales'] = total_costo_materiales
        context['total_costo'] = total_costo_mo + total_costo_mo_ini + total_costo_materiales
        return context

    def generar_pdf(self, request, fecha_inicial, fecha_final, con_mo_saldo_inicial, proyecto):
        context = self.generar_resultados(fecha_inicial, fecha_final, con_mo_saldo_inicial, proyecto)
        context['user'] = request.user
        html_get_template = get_template('reportes/proyectos/costos.html').render(context)
        html = HTML(
            string=html_get_template,
            base_url=request.build_absolute_uri()
        )
        main_doc = html.render(stylesheets=[CSS('static/css/reportes.css')])
        return main_doc
