import os
from io import BytesIO
from urllib.parse import urljoin

from django.conf import settings
from django.template.loader import get_template
from weasyprint import CSS, HTML
from PyPDF2 import PdfFileReader, PdfFileWriter


def _pdf_base_url(request):
    """
    WeasyPrint descarga CSS/imágenes vía HTTP usando base_url.
    Detrás de Nginx, request.build_absolute_uri() usa el dominio público;
    en on-prem el servidor no puede alcanzar su propia IP (hairpin NAT) y el PDF cuelga.
    """
    configured = getattr(settings, 'PDF_GENERATION_BASE_URL', None)
    if configured:
        return configured.rstrip('/') + '/'
    return request.build_absolute_uri('/')


def _resolve_asset_url(url_or_path, base_url):
    if not url_or_path:
        return url_or_path
    if url_or_path.startswith(('http://', 'https://', 'file://')):
        return url_or_path
    if url_or_path.startswith('/media/'):
        media_path = os.path.join(settings.MEDIA_ROOT, url_or_path[len('/media/'):])
        if os.path.isfile(media_path):
            return 'file://' + media_path
    if url_or_path.startswith('/'):
        return urljoin(base_url, url_or_path.lstrip('/'))
    return url_or_path


def _pdf_css_path(relative_path):
    return os.path.join(settings.SITE_ROOT, relative_path)


def get_page_body(boxes):
    for box in boxes:
        if box.element_tag == 'body':
            return box
        return get_page_body(box.all_children())


def generar_base_pdf(request, encabezado_url: str, contexto_documento: dict, template: str) -> BytesIO:
    base_url = _pdf_base_url(request)
    encabezado_resuelto = _resolve_asset_url(encabezado_url, base_url)
    html_get_template = get_template('emails/base/base_pagina_carta.html').render()
    html = HTML(
        string=html_get_template,
        base_url=base_url
    )
    main_doc_base = html.render(
        stylesheets=[CSS(_pdf_css_path('static/css/pdf_carta_email.css'))]
    )
    context = {"encabezado_url": encabezado_resuelto}
    html_get_template = get_template('emails/base/encabezado.html').render(context)
    html = HTML(
        string=html_get_template,
        base_url=base_url
    )
    header_logo = html.render(stylesheets=[CSS(string='div {position: fixed; top: 0, margin:0, padding:0}')])

    header_logo_page = header_logo.pages[0]
    header_logo_body = get_page_body(header_logo_page._page_box.all_children())
    header_logo_body = header_logo_body.copy_with_children(header_logo_body.all_children())

    for i, page in enumerate(main_doc_base.pages):
        page_body = get_page_body(page._page_box.all_children())
        page_body.children += header_logo_body.all_children()

    output_base = BytesIO()
    main_doc_base.write_pdf(
        target=output_base
    )
    pdf_base_reader = PdfFileReader(output_base)

    # CREACION DE DOCUMENTO
    output_documento = BytesIO()
    html_get_template_documento = get_template(template).render(contexto_documento)
    html_documento = HTML(
        string=html_get_template_documento,
        base_url=base_url
    )
    width = '215mm'
    height = '279mm'
    size = 'size: %s %s' % (width, height)
    margin = 'margin: 0.8cm 0.8cm 0.8cm 0.8cm'

    css_string = '@page {text-align: justify; font-family: Arial;font-size: 0.6rem;%s;%s}' % (size, margin)
    main_doc_documento = html_documento.render(stylesheets=[CSS(string=css_string)])
    main_doc_documento.write_pdf(
        target=output_documento
    )
    pdf_documento_reader = PdfFileReader(output_documento)
    cantidad_hojas = pdf_documento_reader.getNumPages()

    # COMBINA BASE CON DOCUMENTO HOJA POR HOJA
    writer_con_logo = PdfFileWriter()
    for nro_hora in range(cantidad_hojas):
        page_object_base = pdf_base_reader.getPage(0)
        page_object_documento = pdf_documento_reader.getPage(nro_hora)
        page_object_documento.mergePage(page_object_base)
        writer_con_logo.addPage(page_object_documento)
    writer_con_logo.write(output_documento)
    output_base.close()
    return output_documento
