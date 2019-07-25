import datetime
import random
from io import BytesIO

from django.core.files import File
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template, render_to_string
from django.utils import timezone
from PyPDF2 import PdfFileReader, PdfFileWriter
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from weasyprint import CSS, HTML

from .models import ProformaAnticipo, ProformaConfiguracion, ProformaAnticipoItem, ProformaAnticipoEnvios


def proforma_anticipo_relacionar_literal(
        proforma_anticipo_id: int,
        literal_id: int
) -> ProformaAnticipo:
    proforma_anticipo = ProformaAnticipo.objects.get(pk=proforma_anticipo_id)
    if not proforma_anticipo.literales.filter(id=literal_id).exists():
        proforma_anticipo.literales.add(literal_id)
        proforma_anticipo = ProformaAnticipo.objects.get(pk=proforma_anticipo_id)
    return proforma_anticipo


def proforma_anticipo_quitar_relacion_literal(
        proforma_anticipo_id: int,
        literal_id: int
) -> ProformaAnticipo:
    proforma_anticipo = ProformaAnticipo.objects.get(pk=proforma_anticipo_id)
    proforma_anticipo.literales.remove(literal_id)
    proforma_anticipo = ProformaAnticipo.objects.get(pk=proforma_anticipo_id)
    return proforma_anticipo


def proforma_anticipo_enviar(
        proforma_anticipo_id: int,
        request,
        email_texto_adicional: str = ''
) -> ProformaAnticipo:
    configuracion = ProformaConfiguracion.objects.first()
    proforma_anticipo = ProformaAnticipo.objects.get(pk=proforma_anticipo_id)

    if not proforma_anticipo.nro_consecutivo:
        now = timezone.now()
        year = now.year.__str__()[2:4]
        month = now.month.__str__()
        month = month if len(month) == 2 else '0%s' % month
        consecutivo = int('%s%s0001' % (year, month))
        qs_con_consecutivo = ProformaAnticipo.objects.filter(nro_consecutivo__gte=consecutivo)
        if qs_con_consecutivo.exists():
            consecutivo = int(qs_con_consecutivo.first().nro_consecutivo) + 1
        proforma_anticipo.nro_consecutivo = consecutivo
        proforma_anticipo.save()

    correos = []
    if proforma_anticipo.email_destinatario:
        correos.append(proforma_anticipo.email_destinatario)
    if proforma_anticipo.email_destinatario_dos:
        correos.append(proforma_anticipo.email_destinatario_dos)

    if not correos:
        raise ValidationError({'_error': 'No se han especificado destinatarios'})
    if configuracion.email_copia_default:
        correos.append(configuracion.email_copia_default)

    if proforma_anticipo.editable:
        proforma_cobro_generar_pdf(id=proforma_anticipo_id, request=request, generar_archivo=True)

    context = {
        "email_texto_adicional": email_texto_adicional,
        "cobro": proforma_anticipo,
        "documentos_adjuntos": proforma_anticipo.documentos.filter(enviar_por_correo=True).all()
    }
    text_content = render_to_string('documentos/contabilidad/correo_base.html', context=context)

    if not configuracion.email_from_default:
        raise serializers.ValidationError({'_error': 'No ha definido un correo de origen en la configuración'})

    msg = EmailMultiAlternatives(
        '%s - %s v%s' % (
            proforma_anticipo.get_tipo_documento_display(), proforma_anticipo.nro_consecutivo,
            proforma_anticipo.version
        ),
        text_content,
        bcc=[configuracion.email_copia_default],
        from_email='Odecopack SAS <%s>' % configuracion.email_from_default,
        to=[proforma_anticipo.email_destinatario, proforma_anticipo.email_destinatario_dos]
    )
    msg.attach_alternative(text_content, "text/html")

    proforma_anticipo = proforma_anticipo_cambiar_estado(
        estado='ENVIADA',
        proforma_anticipo_id=proforma_anticipo_id
    )
    print(proforma_anticipo.documento.archivo.file)
    print(proforma_anticipo.documento.archivo.file.__dict__)
    msg.attach_file(proforma_anticipo.documento.archivo.file.key)
    archivos_para_enviar = proforma_anticipo.documentos.filter(enviar_por_correo=True)
    [msg.attach_file(archivo.archivo.file.key) for archivo in archivos_para_enviar]

    try:
        pass
        msg.send()
    except Exception as e:
        raise serializers.ValidationError(
            {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    return proforma_anticipo


def proforma_anticipo_cambiar_estado(
        estado: str,
        proforma_anticipo_id: int,
        fecha_cobro: datetime.date = None
) -> ProformaAnticipo:
    anticipo = ProformaAnticipo.objects.get(pk=proforma_anticipo_id)
    if estado == 'CERRADA' and not fecha_cobro:
        raise ValidationError({'_error': 'Para cerrar este anticipo, se debe colocar una fecha de cobro'})
    else:
        anticipo.fecha_cobro = fecha_cobro
    if estado == 'EDICION' and anticipo.estado != estado:
        anticipo.version += 1
        anticipo.save()
    if anticipo.estado in 'CERRADA':
        raise ValidationError({'_error': 'Una proforma en estado cerrado no puede cambiar de estado'})
    if estado != anticipo.estado:
        anticipo.fecha_cambio_estado = timezone.now().date()
    anticipo.estado = estado
    anticipo.save()
    return anticipo


def proforma_anticipo_eliminar(
        proforma_anticipo_id: int
):
    anticipo = ProformaAnticipo.objects.get(pk=proforma_anticipo_id)
    if anticipo.estado != 'CREADA':
        raise ValidationError({'_error': 'Solo proformas en estado CREADA se pueden eliminar'})
    anticipo.items.all().delete()
    anticipo.delete()


def proforma_anticipo_item_adicionar(
        proforma_anticipo_id: int,
        descripcion: str,
        cantidad: float,
        referencia: str,
        valor_unitario: float
) -> ProformaAnticipo:
    proforma = ProformaAnticipo.objects.get(pk=proforma_anticipo_id)
    if proforma.editable:
        item = ProformaAnticipoItem.objects.create(
            referencia=referencia,
            descripcion=descripcion,
            cantidad=cantidad,
            valor_unitario=valor_unitario,
            proforma_anticipo_id=proforma_anticipo_id
        )
    else:
        raise ValidationError({'_error': 'No se puede adicionar items, no esta en modo edición'})
    return item.proforma_anticipo


def proforma_anticipo_item_eliminar(
        proforma_anticipo_id: int,
        proforma_anticipo_item_id: int
) -> ProformaAnticipo:
    proforma = ProformaAnticipo.objects.get(pk=proforma_anticipo_id)
    if proforma.editable:
        proforma.items.get(pk=proforma_anticipo_item_id).delete()
    else:
        raise ValidationError({'_error': 'No se puede eliminar items, no esta en modo edición'})
    return proforma


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
        fecha_cobro: datetime.date = None,
        fecha_seguimiento: datetime.date = None,
        observacion: str = None,
        id: int = None
) -> ProformaAnticipo:
    if id:
        anticipo = ProformaAnticipo.objects.get(pk=id)
        if anticipo.estado not in ['EDICION', 'CREADA']:
            if fecha_seguimiento == anticipo.fecha_seguimiento:
                raise ValidationError(
                    {'_error': 'Para poder editar una proforma debe de ponerla primero en estado de edición'})
    else:
        anticipo = ProformaAnticipo()

    anticipo.fecha_cobro = fecha_cobro
    anticipo.fecha_seguimiento = fecha_seguimiento
    anticipo.informacion_locatario = informacion_locatario
    anticipo.informacion_cliente = informacion_cliente
    anticipo.email_destinatario = email_destinatario
    anticipo.email_destinatario_dos = email_destinatario_dos
    anticipo.tipo_documento = tipo_documento
    anticipo.impuesto = impuesto
    anticipo.observacion = observacion
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
    context = {"configuracion": configuracion}
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
        request,
        generar_archivo=False
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
    if generar_archivo:
        filename = "proforma/envios/cobro_%s_%s_v%s_%s.pdf" % (
            anticipo.get_tipo_documento_display(),
            anticipo.nro_consecutivo,
            anticipo.version,
            random.randint(1000, 9999)
        )
        envio = ProformaAnticipoEnvios()
        envio.creado_por = request.user
        envio.version = anticipo.version
        envio.proforma_anticipo = anticipo
        envio.archivo.save(filename, File(output))
        envio.save()
    return output
