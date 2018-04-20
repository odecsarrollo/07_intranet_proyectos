# from django.db.models import Count, F
#
# from django.template.loader import get_template
# from weasyprint import HTML, CSS
#
# from ordenes.models import OrdenExamenFirmas, OrdenExamen
#
#
# def get_page_body(boxes):
#     for box in boxes:
#         if box.element_tag == 'body':
#             return box
#         return get_page_body(box.all_children())
#
#
# class OrdenesPDFMixin(object):
#     def generar_resultados(self, orden):
#         context = {}
#         multifirma = OrdenExamen.objects.select_related(
#             'examen',
#             'examen__subgrupo_cups'
#         ).prefetch_related(
#             'mis_firmas',
#             'mis_firmas__especialista',
#             'mis_firmas__especialista__especialidad',
#         ).annotate(
#             can_firmas=Count("mis_firmas")
#         ).filter(
#             orden=orden,
#             can_firmas__gt=1,
#             examen__especial=False,
#             examen_estado__gte=2
#         )
#
#         una_firma = OrdenExamenFirmas.objects.select_related(
#             'especialista',
#             'especialista__especialidad',
#             'orden_examen',
#             'orden_examen__examen',
#             'orden_examen__examen__subgrupo_cups',
#         ).annotate(
#             especialist=F('especialista'),
#             can_firmas=Count("orden_examen__mis_firmas")
#         ).filter(
#             orden_examen__orden=orden,
#             orden_examen__examen__especial=False,
#             can_firmas=1,
#             orden_examen__examen_estado__gte=2
#         )
#         context['multifirma'] = multifirma
#         context['una_firma'] = una_firma
#         return context
#
#     def generar_resultados_pdf(self, request, orden):
#         context = self.generar_resultados(orden)
#         ctx = {
#             'una_firma': context['una_firma'],
#             'multifirma': context['multifirma'],
#             'paciente': orden.paciente,
#             'orden': orden,
#             'entidad': orden.entidad,
#             'medico_remitente': orden.medico_remitente,
#         }
#
#         # https://gist.github.com/pikhovkin/5642563
#
#         html_get_template = get_template('email/ordenes/resultados/datos_orden.html').render(ctx)
#         html = HTML(
#             string=html_get_template,
#             base_url=request.build_absolute_uri()
#         )
#         header_datos = html.render(
#             stylesheets=[CSS(string='div {position: fixed; top: 0, margin:0, padding:0}')])
#
#         header_datos_page = header_datos.pages[0]
#         header_datos_body = get_page_body(header_datos_page._page_box.all_children())
#         header_datos_body = header_datos_body.copy_with_children(header_datos_body.all_children())
#
#         html_get_template = get_template('email/ordenes/resultados/resultados.html').render(ctx)
#
#         html = HTML(
#             string=html_get_template,
#             base_url=request.build_absolute_uri()
#         )
#
#         main_doc = html.render(stylesheets=[CSS('static/css/pdf_ordenes_resultado.min.css')])
#
#         ctx = {
#             'titulo': 'titulo de prueba ctx',
#         }
#         html_get_template = get_template('email/ordenes/resultados/cabecera.html').render(ctx)
#         html = HTML(
#             string=html_get_template,
#             base_url=request.build_absolute_uri()
#         )
#         header_logo = html.render(
#             stylesheets=[CSS(string='div {position: fixed; top: 0, margin:0, padding:0}')])
#
#         header_logo_page = header_logo.pages[0]
#         header_logo_body = get_page_body(header_logo_page._page_box.all_children())
#         header_logo_body = header_logo_body.copy_with_children(header_logo_body.all_children())
#
#         html_get_template = get_template('email/ordenes/resultados/pie_pagina.html').render(ctx)
#         html = HTML(
#             string=html_get_template,
#             base_url=request.build_absolute_uri()
#         )
#         footer = html.render(stylesheets=[CSS(string='div {position: fixed; bottom: 0.7cm}')])
#
#         footer_page = footer.pages[0]
#         footer_body = get_page_body(footer_page._page_box.all_children())
#         footer_body = footer_body.copy_with_children(footer_body.all_children())
#
#         for i, page in enumerate(main_doc.pages):
#             page_body = get_page_body(page._page_box.all_children())
#
#             page_body.children += header_logo_body.all_children()
#             page_body.children += header_datos_body.all_children()
#             page_body.children += footer_body.all_children()
#         return main_doc
#
#     def generar_recibo_pdf(self, request, orden):
#         ctx = {
#             'orden': orden,
#         }
#         html_get_template = get_template('email/ordenes/recibo/recibo.html').render(ctx)
#
#         html = HTML(
#             string=html_get_template,
#             base_url=request.build_absolute_uri()
#         )
#
#         main_doc = html.render(stylesheets=[CSS('static/css/pdf_ordenes_recibos.min.css')])
#         return main_doc