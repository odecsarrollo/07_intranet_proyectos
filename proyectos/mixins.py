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
            horas_trabajadas=ExpressionWrapper(
                Coalesce(Sum('cantidad_minutos') / 60, 0),
                output_field=DecimalField(max_digits=2)),
            costo_total=ExpressionWrapper(
                Coalesce(
                    Sum((F('cantidad_minutos') / 60) * (
                            F('hoja__tasa__costo') / F('hoja__tasa__nro_horas_mes_trabajadas')
                    )), 0),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal_id=OuterRef('id'),
            verificado=True
        )

        materiales = ItemsLiteralBiable.objects.values('literal').annotate(
            costo_total=Coalesce(Sum('costo_total'), 0)
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

        qsLiterales = Literal.objects
        if proyecto:
            qsLiterales = qsLiterales.filter(
                proyecto=proyecto
            )

        qsLiterales = qsLiterales.annotate(
            costo_mano_obra_iniciales=Coalesce(Sum('mis_horas_trabajadas_iniciales__valor'), 0),
            cantidad_mano_obra_iniciales=ExpressionWrapper(
                Coalesce(Sum('mis_horas_trabajadas_iniciales__cantidad_minutos'), 0) / 60,
                output_field=DecimalField(max_digits=4)
            ),
            cantidad_horas_trabajadas=ExpressionWrapper(
                Subquery(mano_obra.values('horas_trabajadas')),
                output_field=DecimalField(max_digits=4)
            ),
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
        total_horas_mo_ini = 0
        total_horas_mo = 0

        for literal in qsLiterales:

            if literal.cantidad_horas_trabajadas:
                total_horas_mo += literal.cantidad_horas_trabajadas
            if literal.cantidad_mano_obra_iniciales and con_mo_saldo_inicial:
                total_horas_mo_ini += literal.cantidad_mano_obra_iniciales

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

        context['total_horas_mo'] = total_horas_mo
        context['total_horas_mo_ini'] = total_horas_mo_ini

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

    def generar_pdf_costos_dos(self, request, fecha_inicial, fecha_final, con_mo_saldo_inicial):
        context = self.generar_resultados(fecha_inicial, fecha_final, con_mo_saldo_inicial, None)
        context['user'] = request.user
        html_get_template = get_template('reportes/proyectos/costos_dos.html').render(context)
        html = HTML(
            string=html_get_template,
            base_url=request.build_absolute_uri()
        )
        main_doc = html.render(stylesheets=[CSS('static/css/reportes.css')])
        return main_doc
