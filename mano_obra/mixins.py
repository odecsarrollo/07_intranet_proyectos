from django.db.models import ExpressionWrapper, OuterRef, Subquery, DecimalField, Sum, F
from django.db.models.functions import Coalesce

from django.template.loader import get_template
from weasyprint import HTML, CSS

from .models import HoraHojaTrabajo


def get_page_body(boxes):
    for box in boxes:
        if box.element_tag == 'body':
            return box
        return get_page_body(box.all_children())


class HoraHojaTrabajoPDFMixin(object):
    # context['tipo_consulta'] = 'Todo'
    # if fecha_inicial and fecha_final:
    #     context['tipo_consulta'] = 'por lapso'
    #     context['fecha_inicial'] = fecha_inicial
    #     context['fecha_final'] = fecha_final
    # context['literales'] = qsLiterales
    # context['proyecto'] = proyecto
    # context['con_mo_saldo_inicial'] = con_mo_saldo_inicial
    # context['total_costo_mo'] = total_costo_mo
    # context['total_costo_mo_ini'] = total_costo_mo_ini
    # context['total_costo_materiales'] = total_costo_materiales
    # context['total_costo'] = total_costo_mo + total_costo_mo_ini + total_costo_materiales
    #
    # context['total_horas_mo'] = total_horas_mo
    # context['total_horas_mo_ini'] = total_horas_mo_ini
    #
    # return context

    def generar_pdf_costos_tres(
            self,
            request,
            fecha_inicial,
            fecha_final,
            con_mo_saldo_inicial,
            proyecto,
            con_literal=True
    ):
        mano_obra = HoraHojaTrabajo.objects.values(
            'hoja__colaborador__nombres',
            'hoja__colaborador__apellidos',
        )

        if con_literal:
            mano_obra = mano_obra.values(
                'literal__id_literal',
                'literal__descripcion',
            )

        mano_obra = mano_obra.annotate(
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
            verificado=True
        )

        if fecha_inicial and fecha_final:
            mano_obra = mano_obra.filter(
                hoja__fecha__lte=fecha_final,
                hoja__fecha__gte=fecha_inicial
            )

        context = {
            'user': request.user,
            'con_literal': request.user,
            'reporte_data': mano_obra,
        }
        html_get_template = get_template('reportes/proyectos/costos_tres.html').render(context)
        html = HTML(
            string=html_get_template,
            base_url=request.build_absolute_uri()
        )
        main_doc = html.render(stylesheets=[CSS('static/css/reportes.css')])
        return main_doc
