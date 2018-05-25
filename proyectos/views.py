from django.views.generic import DetailView

from .mixins import LiteralesPDFMixin
from .models import Proyecto


class ReporteCostosProyectoView(LiteralesPDFMixin, DetailView):
    model = Proyecto
    template_name = 'reportes/proyectos/costos.html'
    context_object_name = 'proyecto'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        proyecto = self.object
        context = self.generar_resultados('2018-11-30', proyecto)
        main_doc = self.generar_pdf(self.request, '2018-11-30', proyecto)
        main_doc.write_pdf(
            target='correo-prueba.pdf',
            zoom=1,
        )
        return context
