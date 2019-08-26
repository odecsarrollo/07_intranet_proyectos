import datetime
import random
from io import BytesIO

from django.core.files import File
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from envios_emails.services import generar_base_pdf
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
    text_content = render_to_string('emails/contabilidad/correo_base.html', context=context)

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
    nombre_documento = '%s_%s_v%s.pdf' % (
        proforma_anticipo.get_tipo_documento_display(), proforma_anticipo.nro_consecutivo,
        proforma_anticipo.version
    )
    msg.attach(nombre_documento, proforma_anticipo.documento.archivo.read())
    archivos_para_enviar = proforma_anticipo.documentos.filter(enviar_por_correo=True)
    [msg.attach('%s.%s' % (archivo.nombre_archivo, archivo.archivo.name.split('.')[-1]), archivo.archivo.read()) for
     archivo in archivos_para_enviar]
    try:
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
    output_anticipo = generar_base_pdf(
        request,
        configuracion.encabezado.url,
        context,
        'emails/contabilidad/proforma.html'
    )

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
        envio.archivo.save(filename, File(output_anticipo))
        envio.save()
    return output_anticipo
