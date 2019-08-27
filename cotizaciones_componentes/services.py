from io import BytesIO

from django.core.files import File
from django.core.mail import EmailMultiAlternatives
from django.db.models import Max, Q
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from contabilidad_anticipos.models import ProformaConfiguracion
from envios_emails.models import CotizacionComponenteEnvio
from envios_emails.services import generar_base_pdf
from .models import CotizacionComponente, ItemCotizacionComponente, CotizacionComponenteDocumento
from catalogo_productos.models import ItemVentaCatalogo
from bandas_eurobelt.models import BandaEurobelt, ComponenteBandaEurobelt


def cotizacion_componentes_cambiar_estado(
        cotizacion_componente_id: int,
        nuevo_estado: str,
        razon_rechazo: str = None
) -> CotizacionComponente:
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    estado_actual = cotizacion_componente.estado
    error = True
    if nuevo_estado == 'ENV':
        error = False
    elif estado_actual == 'ENV':
        if nuevo_estado == 'REC':
            error = False
    elif estado_actual == 'REC':
        if nuevo_estado in ['INI', 'PRO', 'ELI']:
            error = False
    elif estado_actual == 'PRO':
        if nuevo_estado in ['ELI', 'FIN']:
            error = False
    elif estado_actual in ['ELI', 'FIN']:
        error = True

    if error:
        raise ValidationError(
            {'_error': 'No se puede cambiar una cotización en estado %s a %s' % (estado_actual, nuevo_estado)})

    cotizacion_componente.estado = nuevo_estado
    if estado_actual == 'ELI':
        cotizacion_componente.razon_rechazo = razon_rechazo
    if estado_actual != 'ELI':
        cotizacion_componente.razon_rechazo = None
    cotizacion_componente.save()
    return cotizacion_componente


def cotizacion_componentes_asignar_nro_consecutivo(
        cotizacion_componente_id: int
) -> CotizacionComponente:
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    if cotizacion_componente.nro_consecutivo is None:
        now = timezone.now()
        year = now.year.__str__()[2:4]
        month = now.month.__str__()
        month = month if len(month) == 2 else '0%s' % month
        consecutivo = int('%s%s001' % (year, month))
        qs_con_consecutivo = CotizacionComponente.objects.filter(nro_consecutivo__gte=consecutivo)
        if qs_con_consecutivo.exists():
            consecutivo = int(qs_con_consecutivo.first().nro_consecutivo) + 1
        cotizacion_componente.nro_consecutivo = consecutivo
        cotizacion_componente.save()
    return cotizacion_componente


def cotizacion_componentes_adicionar_item(
        tipo_item: str,
        cotizacion_componente_id: int,
        precio_unitario: float,
        item_descripcion: str,
        item_referencia: str,
        item_unidad_medida: str,
        forma_pago_id: int = None,
        id_item: int = None,
) -> CotizacionComponente:
    if (
            id_item is None or tipo_item == 'Otro') and item_descripcion is None and item_referencia is None and item_unidad_medida is None:
        raise ValidationError({
            '_error': 'Si es un item que no esta en la lista de precios, debe de ingresar la descripción, referencia y unidad de medida'
        })
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    item = ItemCotizacionComponente()
    if tipo_item == 'BandaEurobelt':
        banda_eurobelt = BandaEurobelt.objects.get(pk=id_item)
        item.banda_eurobelt = banda_eurobelt
    if tipo_item == 'ArticuloCatalogo':
        articulo_catalogo = ItemVentaCatalogo.objects.get(pk=id_item)
        item.articulo_catalogo = articulo_catalogo
    if tipo_item == 'ComponenteEurobelt':
        componente_eurobelt = ComponenteBandaEurobelt.objects.get(pk=id_item)
        item.componente_eurobelt = componente_eurobelt

    posicion = cotizacion_componente.items.count() + 1
    item.posicion = posicion
    item.descripcion = item_descripcion
    item.referencia = item_referencia
    item.unidad_medida = item_unidad_medida
    item.cotizacion = cotizacion_componente
    item.cantidad = 1
    item.precio_unitario = precio_unitario
    item.valor_total = precio_unitario
    item.forma_pago_id = forma_pago_id
    item.save()
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    return cotizacion_componente


def cotizacion_componentes_item_actualizar_item(
        item_componente_id: int,
        cantidad: float,
        dias_entrega: float,
) -> ItemCotizacionComponente:
    item = ItemCotizacionComponente.objects.get(pk=item_componente_id)
    if cantidad > 0:
        item.cantidad = cantidad
        item.dias_entrega = dias_entrega
        item.valor_total = cantidad * item.precio_unitario
        item.save()
    else:
        cotizacion_componentes_item_eliminar(item_componente_id=item.id)
    return item


def cotizacion_componentes_item_eliminar(
        item_componente_id: int
):
    item = ItemCotizacionComponente.objects.get(pk=item_componente_id)
    cotizacion = item.cotizacion
    item.delete()
    items_cotizacion = ItemCotizacionComponente.objects.filter(
        cotizacion=cotizacion
    ).order_by(
        'posicion'
    )
    index = 0
    for elemento in items_cotizacion:
        index += 1
        elemento.posicion = index
        elemento.save()


def cotizacion_componentes_item_cambiar_posicion(
        item_componente_id: int,
        direccion: str
) -> ItemCotizacionComponente:
    item = ItemCotizacionComponente.objects.get(pk=item_componente_id)
    posicion_maxima = item.cotizacion.items.aggregate(max=Max('posicion'))['max']
    if (item.posicion >= 1 and direccion == 'BAJA') or (item.posicion > 1 and direccion == 'SUBE'):
        nueva_posicion = item.posicion - 1 if direccion == 'SUBE' else item.posicion + 1
        if nueva_posicion <= posicion_maxima:
            item.posicion = nueva_posicion
            item.save()
            items_cotizacion = ItemCotizacionComponente.objects.exclude(pk=item_componente_id).filter(
                cotizacion=item.cotizacion
            ).order_by(
                'posicion'
            )
            index = 0
            for elemento in items_cotizacion:
                index += 1
                if item.posicion == index:
                    index += 1
                elemento.posicion = index
                elemento.save()
    return item


def cotizacion_componentes_enviar(
        request,
        cotizacion_componente_id: int,
        emails_destino: list = None
) -> CotizacionComponente:
    cotizacion = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    if cotizacion.estado not in ['INI', 'ENV', 'REC']:
        raise ValidationError({'_error': 'No es posible enviar una cotización en estado %s' % cotizacion.estado})

    cotizacion_componentes_asignar_nro_consecutivo(
        cotizacion_componente_id=cotizacion_componente_id
    )
    output_documento = cotizacion_componentes_generar_pdf(
        cotizacion_id=cotizacion.id,
        request=request
    )

    if cotizacion.nro_consecutivo is None:
        cotizacion = cotizacion_componentes_asignar_nro_consecutivo(
            cotizacion_componente_id=cotizacion.id
        )
    version = cotizacion.versiones.count() + 1

    if cotizacion.estado == 'INI':
        cotizacion.estado = 'ENV'
        cotizacion.save()
        filename = "%s_v%s.pdf" % (
            cotizacion.nro_consecutivo,
            version
        )
        documento = CotizacionComponenteDocumento()
        documento.cotizacion_componente = cotizacion
        documento.version = version
        documento.creado_por = request.user
        documento.pdf_cotizacion.save(filename, File(output_documento))
        documento.save()

    CotizacionComponenteEnvio.objects.create(
        cotizacion_componente=cotizacion,
        archivo=cotizacion.pdf,
        creado_por=request.user,
        correo_from=request.user.email if request.user.email else '',
        correos_to=','.join(emails_destino)
    )

    context = {
        "cotizacion": cotizacion
    }
    text_content = render_to_string('emails/cotizacion_componente/cotizacion_componente.html', context=context)
    email_from = cotizacion.responsable.email if cotizacion.responsable else cotizacion.creado_por.email
    if email_from not in emails_destino:
        emails_destino.append(email_from)

    nombre_cotizacion = 'Cotización - %s v%s' % (
        cotizacion.nro_consecutivo,
        cotizacion.pdf.version
    )
    msg = EmailMultiAlternatives(
        nombre_cotizacion,
        text_content,
        from_email='Odecopack SAS <%s>' % email_from,
        to=emails_destino
    )
    msg.attach_alternative(text_content, "text/html")
    msg.attach('%s.pdf' % nombre_cotizacion, cotizacion.pdf.pdf_cotizacion.read())
    archivos_para_enviar = cotizacion.adjuntos.filter(Q(imagen='') | Q(imagen=None)).all()
    imagenes_para_enviar = cotizacion.adjuntos.filter(Q(adjunto='') | Q(adjunto=None)).all()
    [msg.attach('%s.%s' % (adjunto.nombre_adjunto, adjunto.adjunto.name.split('.')[-1]), adjunto.adjunto.read()) for
     adjunto in archivos_para_enviar]
    [msg.attach('%s.%s' % (adjunto.nombre_adjunto, adjunto.imagen.name.split('.')[-1]), adjunto.imagen.read()) for
     adjunto in imagenes_para_enviar]
    try:
        msg.send()
    except Exception as e:
        raise ValidationError(
            {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    return cotizacion


def cotizacion_componentes_generar_pdf(
        cotizacion_id: int,
        request
) -> BytesIO:
    cotizacion = CotizacionComponente.objects.prefetch_related('items').get(pk=cotizacion_id)
    configuracion = ProformaConfiguracion.objects.first()
    context = {
        "configuracion": configuracion,
        "cotizacion": cotizacion
    }
    output_anticipo = generar_base_pdf(
        request,
        configuracion.encabezado.url,
        context,
        'emails/cotizacion_componente/cotizacion_componente.html'
    )
    return output_anticipo
