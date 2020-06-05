import datetime
from io import BytesIO

from django.contrib.auth.models import User
from django.core.files import File
from django.core.mail import EmailMultiAlternatives
from django.db.models import Q
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from contabilidad_anticipos.models import ProformaConfiguracion
from envios_emails.models import CotizacionComponenteEnvio
from envios_emails.services import generar_base_pdf
from cargues_detalles.models import FacturaDetalle
from .models import (
    CotizacionComponente,
    ItemCotizacionComponente,
    CotizacionComponenteDocumento,
    CotizacionComponenteSeguimiento
)
from catalogo_productos.models import ItemVentaCatalogo
from bandas_eurobelt.models import BandaEurobelt, ComponenteBandaEurobelt


def relacionar_cotizacion_con_factura(
        cotizacion_componente_id: int,
        factura_id: int,
        accion: str,
        usuario_id: int = None
):
    factura = FacturaDetalle.objects.select_related(
        'cliente',
        'colaborador',
        'colaborador__usuario',
    ).get(pk=factura_id)
    cotizacion = CotizacionComponente.objects.select_related(
        'responsable',
        'creado_por'
    ).get(pk=cotizacion_componente_id)
    user_responsable_cotizacion = cotizacion.responsable if cotizacion.responsable else cotizacion.creado_por
    user_vendedor_factura = factura.colaborador.usuario if factura.colaborador and factura.colaborador.usuario else None
    usuario = User.objects.get(pk=usuario_id)
    if accion == 'add':
        if not (usuario_id == user_responsable_cotizacion.id or usuario.is_superuser):
            raise ValidationError({
                '_error': 'Sólo el vendedor responsable o un super usuario puede crear la relación de la cotización con la factura'})

        cliente_factura = factura.cliente
        cliente_cotizacion = cotizacion.cliente
        if cliente_cotizacion != cliente_factura:
            raise ValidationError({
                '_error': 'El clientes %s de la cotización no corresponde con el cliente %s de la factura' % (
                    cliente_cotizacion.nombre, cliente_factura.nombre)})
        if user_responsable_cotizacion != user_vendedor_factura:
            raise ValidationError({'_error': 'El vendedor que cotizó no es el mismo que vendió, por favor revisar'})
        estado_anterior = cotizacion.estado
        cotizacion.estado = 'FIN'
        cotizacion.save()
        cotizacion.facturas.add(factura)
        cotizacion_componentes_add_seguimiento(
            cotizacion_componente_id=cotizacion_componente_id,
            estado_anterior=estado_anterior,
            tipo_seguimiento='EST',
            descripcion='Se relaciona con factura %s-%s' % (factura.tipo_documento, factura.nro_documento),
            creado_por=usuario
        )
    if accion == 'rem':
        if not (usuario_id == user_responsable_cotizacion.id or usuario.is_superuser):
            raise ValidationError({
                '_error': 'Sólo el vendedor responsable o un super usuario puede quitar la relación de la cotización con la factura'})
        ultimo_seguimiento = CotizacionComponenteSeguimiento.objects.filter(
            cotizacion_componente=cotizacion,
            tipo_seguimiento='EST'
        ).last()
        cotizacion.estado = ultimo_seguimiento.estado_anterior if ultimo_seguimiento is not None and ultimo_seguimiento.estado_anterior is not None else cotizacion.estado
        cotizacion.save()
        cotizacion.facturas.remove(factura)
        cotizacion_componentes_add_seguimiento(
            cotizacion_componente_id=cotizacion_componente_id,
            tipo_seguimiento='EST',
            descripcion='Se quita relacion con factura %s-%s y se regresa al estado anterior %s' % (
                factura.tipo_documento, factura.nro_documento, cotizacion.get_estado_display()),
            creado_por=usuario
        )


def cotizacion_componentes_cambiar_fecha_proximo_seguimiento(
        cotizacion_componente_id: int,
        usuario: User,
        fecha_verificacion_proximo_seguimiento: datetime,
        fecha_proximo_seguimiento_descripcion: str
) -> CotizacionComponente:
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    fecha_anterior = cotizacion_componente.fecha_verificacion_proximo_seguimiento
    if (fecha_proximo_seguimiento_descripcion == '' or fecha_verificacion_proximo_seguimiento is None):
        raise ValidationError({'_error': 'Por favor colobar el motivo de cambio'})
    if not (cotizacion_componente.responsable == usuario or usuario.is_superuser):
        raise ValidationError({
            '_error': 'Sólo el responsable de la cotización (%s) o el administrador del sistema pueden cambiar la fecha de verificación del próximo seguimiento' % cotizacion_componente.responsable})
    if cotizacion_componente.estado not in ['ENV', 'REC', 'PRO', 'APL']:
        raise ValidationError({
            '_error': 'Las cotizaciones en estado %s no se les puede modificar fechas de próximo seguimiento' % cotizacion_componente.get_estado_display()})
    cotizacion_componentes_add_seguimiento(
        cotizacion_componente_id=cotizacion_componente_id,
        tipo_seguimiento='SEG',
        descripcion='Cambio fecha de próximo seguimiento de %s a %s. %s' % (
            fecha_anterior,
            cotizacion_componente.fecha_verificacion_proximo_seguimiento,
            fecha_proximo_seguimiento_descripcion
        ),
        creado_por=usuario,
        fecha_verificacion_proximo_seguimiento=fecha_verificacion_proximo_seguimiento
    )
    return cotizacion_componente


def cotizacion_componentes_cambiar_estado(
        cotizacion_componente_id: int,
        nuevo_estado: str,
        fecha_verificacion_proximo_seguimiento: datetime,
        usuario: User,
        razon_rechazo: str = None,
) -> CotizacionComponente:
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    estado_actual = cotizacion_componente.estado
    error = True
    cambio_estado = nuevo_estado != estado_actual
    estado_actual_display = cotizacion_componente.get_estado_display()

    if not (cotizacion_componente.responsable == usuario or usuario.is_superuser):
        raise ValidationError({
            '_error': 'Sólo el responsable de la cotización (%s) o el administrador del sistema pueden cambiar el estado' % cotizacion_componente.responsable})

    if fecha_verificacion_proximo_seguimiento is None and nuevo_estado not in ['INI', 'ELI']:
        raise ValidationError({'_error': 'No se digitó la fecha de seguimiento para la cotización'})

    if cambio_estado:
        if cotizacion_componente.facturas.exists() and nuevo_estado != 'FIN':
            raise ValidationError({
                '_error': 'No es posible cambiar de estado la cotización, esta ya tiene (%s) facturas relacionadas' % cotizacion_componente.facturas.count()
            })
        if nuevo_estado == 'ENV':
            error = False
        elif estado_actual == 'ENV':
            if nuevo_estado == 'REC':
                error = False
        elif estado_actual == 'APL':
            if nuevo_estado in ['REC', 'PRO', 'ELI', 'INI']:
                error = False
        elif estado_actual == 'REC':
            if nuevo_estado in ['INI', 'PRO', 'ELI', 'APL']:
                error = False
        elif estado_actual == 'PRO':
            if nuevo_estado in ['ELI', 'FIN', 'APL']:
                error = False
        elif estado_actual in ['ELI', 'FIN']:
            error = True

        if not usuario.is_superuser:
            if nuevo_estado != 'ENV':
                if cotizacion_componente.responsable is not None and usuario != cotizacion_componente.responsable:
                    cotizacion_componente.estado = nuevo_estado
                    raise ValidationError(
                        {
                            '_error': 'No se puede cambiar una cotización en estado %s a %s si usted no es el responsable de la misma' % (
                                estado_actual_display, cotizacion_componente.get_estado_display())})

        if error:
            cotizacion_componente.estado = nuevo_estado
            raise ValidationError(
                {'_error': 'No se puede cambiar una cotización en estado %s a %s' % (
                    estado_actual_display, cotizacion_componente.get_estado_display())})

        cotizacion_componente.estado = nuevo_estado
        cotizacion_componente.fecha_verificacion_proximo_seguimiento = fecha_verificacion_proximo_seguimiento
        cotizacion_componente.fecha_verificacion_cambio_estado = timezone.now().date()
        if nuevo_estado == 'ELI':
            cotizacion_componente.razon_rechazo = razon_rechazo
        if nuevo_estado != 'ELI':
            cotizacion_componente.razon_rechazo = None
        cotizacion_componente.save()
        cotizacion_componentes_add_seguimiento(
            cotizacion_componente_id=cotizacion_componente_id,
            tipo_seguimiento='EST',
            descripcion='Cambio a estado %s' % (cotizacion_componente.get_estado_display()),
            creado_por=usuario,
            estado_anterior=estado_actual
        )
    return cotizacion_componente


def cotizacion_componentes_asignar_nro_consecutivo(
        cotizacion_componente: CotizacionComponente
) -> CotizacionComponente:
    if cotizacion_componente.nro_consecutivo is None:
        now = timezone.now()
        year = now.year.__str__()[2:4]
        month = now.month.__str__()
        month = month if len(month) == 2 else '0%s' % month
        consecutivo = int('%s%s001' % (year, month))
        qs_con_consecutivo = CotizacionComponente.objects.filter(nro_consecutivo__gte=consecutivo)
        if qs_con_consecutivo.exists():
            consecutivo = int(qs_con_consecutivo.last().nro_consecutivo) + 1
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
        tipo_transporte: str,
        tasa: float = 0,
        moneda_origen: str = None,
        moneda_origen_costo: float = 0,
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
        if articulo_catalogo.item_sistema_informacion:
            siesa_cloud_ultimo_costo = articulo_catalogo.item_sistema_informacion.ultimo_costo
            if cotizacion_componente.moneda != 'COP':
                tasa_inversa = articulo_catalogo.margen.proveedor.moneda.cambio
                tasa_usd = articulo_catalogo.margen.proveedor.moneda.cambio_a_usd
                siesa_cloud_ultimo_costo = siesa_cloud_ultimo_costo / tasa_inversa
                siesa_cloud_ultimo_costo = siesa_cloud_ultimo_costo * tasa_usd
            if siesa_cloud_ultimo_costo > float(precio_unitario):
                raise ValidationError({
                    '_error': 'Existe un problema de margen, por favor revisar. El costo en siesa cloud es mayor que el precio de venta unitario de la lista de precios'
                })
        item.articulo_catalogo = articulo_catalogo
    if tipo_item == 'ComponenteEurobelt':
        componente_eurobelt = ComponenteBandaEurobelt.objects.get(pk=id_item)
        item.componente_eurobelt = componente_eurobelt

    posicion = cotizacion_componente.items.count() + 1
    if cotizacion_componente.moneda == 'COP':
        item.tasa_cambio_a_pesos = tasa
    else:
        item.tasa_cambio_a_dolares = tasa
    item.posicion = posicion
    item.moneda_origen = moneda_origen
    item.moneda_origen_costo = moneda_origen_costo
    item.descripcion = item_descripcion
    item.referencia = item_referencia
    item.unidad_medida = item_unidad_medida
    item.cotizacion = cotizacion_componente
    item.cantidad = 1
    item.precio_unitario = precio_unitario
    item.valor_total = precio_unitario
    item.forma_pago_id = forma_pago_id
    item.transporte_tipo = tipo_transporte
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
        cotizacion_componentes_item_eliminar(item_componente_id=item_componente_id)
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
        cotizacion_componente_id: int,
        item_uno_id: int,
        item_dos_id: int
) -> ItemCotizacionComponente:
    item_uno = ItemCotizacionComponente.objects.get(pk=item_uno_id)
    item_dos = ItemCotizacionComponente.objects.get(pk=item_dos_id)
    item_uno_posicion = item_uno.posicion
    item_dos_posicion = item_dos.posicion
    item_uno.posicion = item_dos_posicion
    item_dos.posicion = item_uno_posicion
    item_uno.save()
    item_dos.save()
    return item_uno


def cotizacion_componentes_enviar(
        request,
        cotizacion_componente: CotizacionComponente,
        no_enviar: bool,
        emails_destino: list = None,
        fecha_verificacion_proximo_seguimiento: datetime = None,
) -> CotizacionComponente:
    if cotizacion_componente.estado not in ['INI', 'ENV', 'REC']:
        raise ValidationError(
            {'_error': 'No es posible enviar una cotización en estado %s' % cotizacion_componente.estado})

    if cotizacion_componente.nro_consecutivo is None:
        cotizacion_componente = cotizacion_componentes_asignar_nro_consecutivo(
            cotizacion_componente=cotizacion_componente
        )
    version = cotizacion_componente.versiones.count() + 1

    if fecha_verificacion_proximo_seguimiento:
        cotizacion_componente.fecha_verificacion_proximo_seguimiento = fecha_verificacion_proximo_seguimiento
        cotizacion_componente.fecha_verificacion_cambio_estado = timezone.now().date()

    if cotizacion_componente.estado == 'INI':
        cotizacion_componente.estado = 'ENV'
        if cotizacion_componente.responsable is None:
            if cotizacion_componente.cliente.colaborador_componentes:
                cotizacion_componente.responsable = cotizacion_componente.cliente.colaborador_componentes.usuario
            else:
                cotizacion_componente.responsable = cotizacion_componente.creado_por
        cotizacion_componente.save()
        filename = "%s_v%s.pdf" % (
            cotizacion_componente.nro_consecutivo,
            version
        )
        documento = CotizacionComponenteDocumento()
        documento.cotizacion_componente = cotizacion_componente
        documento.version = version
        documento.creado_por = request.user
        documento.save()
        output_documento = cotizacion_componentes_generar_pdf(
            cotizacion_componente=cotizacion_componente,
            request=request
        )
        documento.pdf_cotizacion.save(filename, File(output_documento))
        documento.save()

    context = {
        "cotizacion_componente": cotizacion_componente
    }
    text_content = render_to_string('emails/cotizacion_componente/cotizacion_componente.html', context=context)
    usuario_responsable = cotizacion_componente.responsable
    email_from = 'webmaster@odecopack.com'
    email_alias = 'ODECOPACK VENTAS -'
    if usuario_responsable is not None:
        if usuario_responsable.is_active and usuario_responsable.email:
            email_from = usuario_responsable.email
            email_alias = usuario_responsable.mi_colaborador.alias_correo if hasattr(usuario_responsable,
                                                                                     'mi_colaborador') else ''
    else:
        usuario_creador = cotizacion_componente.creado_por
        if usuario_creador is not None:
            if usuario_creador.is_active and usuario_creador.email:
                email_from = usuario_creador.email
                email_alias = usuario_creador.mi_colaborador.alias_correo if hasattr(usuario_creador,
                                                                                     'mi_colaborador') else ''

    if email_from not in emails_destino:
        emails_destino.append(email_from)

    CotizacionComponenteEnvio.objects.create(
        cotizacion_componente=cotizacion_componente,
        archivo=cotizacion_componente.pdf,
        creado_por=request.user,
        correo_from=email_from,
        correos_to=','.join(emails_destino),
    )

    nombre_cotizacion = 'Cotización - %s v%s' % (
        cotizacion_componente.nro_consecutivo,
        cotizacion_componente.pdf.version
    )
    if not no_enviar:
        msg = EmailMultiAlternatives(
            nombre_cotizacion,
            text_content,
            from_email='%s <%s>' % (email_alias, email_from),
            to=emails_destino
        )
        msg.attach_alternative(text_content, "text/html")
        msg.attach('%s.pdf' % nombre_cotizacion, cotizacion_componente.pdf.pdf_cotizacion.read())
        archivos_para_enviar = cotizacion_componente.adjuntos.filter(Q(imagen='') | Q(imagen=None))
        imagenes_para_enviar = cotizacion_componente.adjuntos.filter(Q(adjunto='') | Q(adjunto=None))
        [msg.attach('%s.%s' % (adjunto.nombre_adjunto, adjunto.adjunto.name.split('.')[-1]), adjunto.adjunto.read()) for
         adjunto in archivos_para_enviar]
        [msg.attach('%s.%s' % (adjunto.nombre_adjunto, adjunto.imagen.name.split('.')[-1]), adjunto.imagen.read()) for
         adjunto in imagenes_para_enviar]
        try:
            msg.send()
            cotizacion_componentes_add_seguimiento(
                cotizacion_componente_id=cotizacion_componente.id,
                tipo_seguimiento='ENV',
                descripcion='Envío de correo para %s desde %s' % (emails_destino, email_from),
                creado_por=request.user,
                fecha=timezone.now(),
                pdf_cotizacion_id=cotizacion_componente.pdf.id
            )
        except Exception as e:
            raise ValidationError(
                {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    else:
        cotizacion_componentes_add_seguimiento(
            cotizacion_componente_id=cotizacion_componente.id,
            tipo_seguimiento='ENV',
            descripcion='Se descarga y no envia por correo',
            creado_por=request.user,
            fecha=timezone.now(),
            pdf_cotizacion_id=cotizacion_componente.pdf.id
        )
    return cotizacion_componente


def cotizacion_componentes_generar_pdf(
        cotizacion_componente: CotizacionComponente,
        request
) -> BytesIO:
    configuracion = ProformaConfiguracion.objects.first()
    context = {
        "configuracion": configuracion,
        "cotizacion": cotizacion_componente
    }
    output_cotizacion = generar_base_pdf(
        request,
        configuracion.encabezado.url,
        context,
        'emails/cotizacion_componente/cotizacion_componente.html'
    )
    return output_cotizacion


def cotizacion_componentes_add_seguimiento(
        cotizacion_componente_id: int,
        tipo_seguimiento: str,
        descripcion: str,
        creado_por: User,
        fecha: datetime = timezone.now(),
        pdf_cotizacion_id: int = None,
        fecha_verificacion_proximo_seguimiento: datetime = None,
        estado_anterior: str = None
) -> CotizacionComponenteSeguimiento:
    seguimiento = CotizacionComponenteSeguimiento()
    seguimiento.cotizacion_componente_id = cotizacion_componente_id
    seguimiento.tipo_seguimiento = tipo_seguimiento
    seguimiento.descripcion = descripcion
    seguimiento.fecha = fecha
    seguimiento.creado_por = creado_por
    seguimiento.documento_cotizacion_id = pdf_cotizacion_id
    if tipo_seguimiento == 'EST':
        seguimiento.estado_anterior = estado_anterior
    seguimiento.save()

    if tipo_seguimiento == 'SEG':
        cotizacion = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
        cotizacion.fecha_verificacion_proximo_seguimiento = fecha_verificacion_proximo_seguimiento
        cotizacion.fecha_verificacion_cambio_estado = timezone.now().date()
        cotizacion.save()

    return seguimiento


def cotizacion_componentes_delete_seguimiento(
        cotizacion_componente_seguimiento_id: int,
        cotizacion_componente_id: int,
        eliminado_por: User
):
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    if cotizacion_componente.seguimientos.filter(pk=cotizacion_componente_seguimiento_id).exists():
        cotizacion_componente_seguimiento = CotizacionComponenteSeguimiento.objects.get(
            pk=cotizacion_componente_seguimiento_id)
        cotizacion_componente = cotizacion_componente_seguimiento.cotizacion_componente
        if cotizacion_componente.estado not in ['ENV', 'REC', 'PRO']:
            raise ValidationError({
                '_error': 'No se puede eliminar seguimiento a una cotización en estado %s' % cotizacion_componente.get_estado_display()})
        if cotizacion_componente_seguimiento.tipo_seguimiento not in ['EST', 'ENV']:
            if cotizacion_componente_seguimiento.creado_por == eliminado_por:
                cotizacion_componente_seguimiento.delete()
            else:
                raise ValidationError(
                    {'_error': 'No se puede eliminar seguimiento realizado por otro usuario'})
        else:
            raise ValidationError(
                {'_error': 'No se puede eliminar seguimiento tipo Cambio de Estado, ni Envio de Correo'})
    else:
        raise ValidationError(
            {'_error': 'Esta cotización ya no tiene este seguimiento'})
