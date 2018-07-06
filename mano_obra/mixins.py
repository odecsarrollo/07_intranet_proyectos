from django.db.models import ExpressionWrapper, OuterRef, Subquery, DecimalField, Sum, F
from django.db.models.functions import Coalesce

from django.template.loader import get_template
from weasyprint import HTML, CSS

from .models import HoraHojaTrabajo
from cguno.models import ItemsLiteralBiable


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

    def generar_pdf_costos_tres(self, request, fecha_inicial, fecha_final, con_mo_saldo_inicial):
        context = {
            'user': request.user,
            'base': HoraHojaTrabajo.objects.all(),
        }
        html_get_template = get_template('reportes/proyectos/costos_tres.html').render(context)
        html = HTML(
            string=html_get_template,
            base_url=request.build_absolute_uri()
        )
        main_doc = html.render(stylesheets=[CSS('static/css/reportes.css')])
        return main_doc
