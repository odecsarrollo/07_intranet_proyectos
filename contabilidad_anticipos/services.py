import datetime
from io import BytesIO

from django.template.loader import get_template
from django.utils import timezone
from PyPDF2 import PdfFileReader, PdfFileWriter
from weasyprint import CSS, HTML

from .models import ProformaAnticipo, ProformaConfiguracion, ProformaAnticipoItem


def proforma_anticipo_item_adicionar(
        proforma_anticipo_id: int,
        descripcion: str,
        cantidad: float,
        valor_unitario: float
) -> ProformaAnticipo:
    item = ProformaAnticipoItem.objects.create(
        descripcion=descripcion,
        cantidad=cantidad,
        valor_unitario=valor_unitario,
        proforma_anticipo_id=proforma_anticipo_id
    )
    return item.proforma_anticipo


def proforma_anticipo_crear_actualizar(
        informacion_cliente: str,
        divisa: str,
        nit: str,
        nombre_cliente: str,
        condicion_pago: str,
        nro_orden_compra: str,
        tipo_documento: str,
        fecha: datetime,
        informacion_locatario: str = None,
        email_destinatario: str = '',
        email_destinatario_dos: str = '',
        impuesto=float,
        id: int = None
) -> ProformaAnticipo:
    if id:
        anticipo = ProformaAnticipo.objects.get(pk=id)
    else:
        now = timezone.now()
        year = now.year.__str__()[2:4]
        month = now.month.__str__()
        month = month if len(month) == 2 else '1%s' % month
        consecutivo = int('%s%s0000' % (year, month))
        qs_con_consecutivo = ProformaAnticipo.objects.filter(nro_consecutivo__gte=consecutivo)
        if qs_con_consecutivo.exists():
            consecutivo = int(qs_con_consecutivo.first().nro_consecutivo) + 1
        anticipo = ProformaAnticipo()
        anticipo.nro_consecutivo = consecutivo

    anticipo.informacion_locatario = informacion_locatario
    anticipo.informacion_cliente = informacion_cliente
    anticipo.email_destinatario = email_destinatario
    anticipo.email_destinatario_dos = email_destinatario_dos
    anticipo.tipo_documento = tipo_documento
    anticipo.impuesto = impuesto
    anticipo.divisa = divisa
    anticipo.nit = nit
    anticipo.nombre_cliente = nombre_cliente
    anticipo.condicion_pago = condicion_pago
    anticipo.nro_orden_compra = nro_orden_compra
    anticipo.fecha = fecha
    anticipo.save()
    return anticipo


def get_page_body(boxes):
    for box in boxes:
        if box.element_tag == 'body':
            return box
        return get_page_body(box.all_children())


def generar_base_pdf(request) -> BytesIO:
    html_get_template = get_template('documentos/contabilidad/base_pagina_carta.html').render()
    html = HTML(
        string=html_get_template,
        base_url=request.build_absolute_uri()
    )
    main_doc = html.render(stylesheets=[CSS('static/css/pdf_ordenes_resultado.css')])
    configuracion = ProformaConfiguracion.objects.first()
    context = {
        "configuracion": configuracion
    }
    html_get_template = get_template('documentos/contabilidad/encabezado.html').render(context)
    html = HTML(
        string=html_get_template,
        base_url=request.build_absolute_uri()
    )
    header_logo = html.render(stylesheets=[CSS(string='div {position: fixed; top: 0, margin:0, padding:0}')])

    header_logo_page = header_logo.pages[0]
    header_logo_body = get_page_body(header_logo_page._page_box.all_children())
    header_logo_body = header_logo_body.copy_with_children(header_logo_body.all_children())

    for i, page in enumerate(main_doc.pages):
        page_body = get_page_body(page._page_box.all_children())
        page_body.children += header_logo_body.all_children()

    output_base = BytesIO()
    main_doc.write_pdf(
        target=output_base
    )
    return output_base


def proforma_cobro_generar_pdf(
        id: int,
        request
) -> BytesIO:
    anticipo = ProformaAnticipo.objects.prefetch_related('items').get(pk=id)
    configuracion = ProformaConfiguracion.objects.first()
    context = {
        "configuracion": configuracion,
        "anticipo": anticipo
    }
    html_get_template = get_template('documentos/contabilidad/proforma.html').render(context)
    html = HTML(
        string=html_get_template,
        base_url=request.build_absolute_uri()
    )
    width = '215mm'
    height = '279mm'
    size = 'size: %s %s' % (width, height)
    margin = 'margin: 0.8cm 0.8cm 0.8cm 0.8cm'

    css_string = '@page {text-align: justify; font-family: Arial;font-size: 0.6rem;%s;%s}' % (size, margin)
    main_doc = html.render(stylesheets=[CSS(string=css_string)])
    output = BytesIO()
    main_doc.write_pdf(
        target=output
    )
    pdf_documento_reader = PdfFileReader(output)
    writer_con_logo = PdfFileWriter()
    cantidad_hojas = pdf_documento_reader.getNumPages()

    base = generar_base_pdf(request)
    pdf_base_reader = PdfFileReader(base)

    for nro_hora in range(cantidad_hojas):
        page_object_base = pdf_base_reader.getPage(0)
        page_object_documento = pdf_documento_reader.getPage(nro_hora)
        page_object_documento.mergePage(page_object_base)
        writer_con_logo.addPage(page_object_documento)
    writer_con_logo.write(output)
    return output
