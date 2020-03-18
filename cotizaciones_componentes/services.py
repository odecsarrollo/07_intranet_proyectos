import datetime
from io import BytesIO

from django.contrib.auth.models import User
from django.core.files import File
from django.core.mail import EmailMultiAlternatives
from django.db.models import Q
from django.http import HttpRequest
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from contabilidad_anticipos.models import ProformaConfiguracion
from correos_servicios.models import CorreoAplicacion
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
) -> (CotizacionComponente, FacturaDetalle):
    factura = FacturaDetalle.objects.get(pk=factura_id)
    cotizacion = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
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
        cotizacion.estado = 'FIN'
        cotizacion.save()
        cotizacion.facturas.add(factura)
    if accion == 'rem':
        if not (usuario_id == user_responsable_cotizacion.id or usuario.is_superuser):
            raise ValidationError({
                '_error': 'Sólo el vendedor responsable o un super usuario puede quitar la relación de la cotización con la factura'})
        cotizacion.facturas.remove(factura)
    factura = FacturaDetalle.objects.get(pk=factura_id)
    cotizacion = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    return cotizacion, factura


def cotizacion_componentes_cambiar_estado(
        cotizacion_componente_id: int,
        nuevo_estado: str,
        usuario: User,
        razon_rechazo: str = None,
) -> CotizacionComponente:
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    estado_actual = cotizacion_componente.estado
    error = True
    cambio_estado = nuevo_estado != estado_actual
    estado_actual_display = cotizacion_componente.get_estado_display()
    if cambio_estado:
        items_esperando_verificacion = cotizacion_componente.items.filter(
            verificada_personalizacion=False,
            verificar_personalizacion=True
        )
        if estado_actual == 'INI' and items_esperando_verificacion.exists():
            cotizacion_componente.estado = nuevo_estado
            raise ValidationError({
                '_error': 'No es posible carmbiar al estado %s una cotización que tiene items personalizados por ser verificados' % cotizacion_componente.get_estado_display()
            })
        if cotizacion_componente.facturas.exists() and nuevo_estado != 'FIN':
            raise ValidationError({
                '_error': 'No es posible cambiar de estado la cotización, esta ya tiene (%s) facturas relacionadas' % cotizacion_componente.facturas.count()
            })
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

        if not usuario.is_superuser:
            if nuevo_estado != 'ENV':
                if cotizacion_componente.responsable is not None and usuario != cotizacion_componente.responsable:
                    cotizacion_componente.estado = nuevo_estado
                    raise ValidationError(
                        {
                            '_error': 'No se puede cambiar una cotización en estado %s a %s si usted no es el responsable de la misma' % (
                                estado_actual_display, cotizacion_componente.get_estado_display())})

        if error:
            raise ValidationError(
                {'_error': 'No se puede cambiar una cotización en estado %s a %s' % (estado_actual, nuevo_estado)})

        cotizacion_componente.estado = nuevo_estado
        if nuevo_estado == 'ELI':
            cotizacion_componente.razon_rechazo = razon_rechazo
        if nuevo_estado != 'ELI':
            cotizacion_componente.razon_rechazo = None
        cotizacion_componente.save()
        cotizacion_componentes_add_seguimiento(
            cotizacion_componente_id=cotizacion_componente_id,
            tipo_seguimiento='EST',
            descripcion='Cambio a estado %s' % (cotizacion_componente.get_estado_display()),
            creado_por=usuario
        )
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
            consecutivo = int(qs_con_consecutivo.last().nro_consecutivo) + 1
        cotizacion_componente.nro_consecutivo = consecutivo
        cotizacion_componente.save()
    return cotizacion_componente


def cotizacion_componentes_item_verificar(
        item_cotizacion_componente_id: int,
        usuario_id: int
) -> ItemCotizacionComponente:
    item = ItemCotizacionComponente.objects.get(pk=item_cotizacion_componente_id)
    if not item.verificar_personalizacion:
        ValidationError({'_error': 'Este item no requiere ya verificación, consultar con el vendedor'})
    item.verifico_usuario_id = usuario_id
    item.verifico_fecha = timezone.now()
    item.save()
    return item


def cotizacion_componentes_solicitar_verificacion_items(
        cotizacion_id: int,
        usuario_id: int,
        request
) -> CotizacionComponente:
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_id)
    items_para_solicitar_verificacion = cotizacion_componente.items.filter(
        verificar_personalizacion=True,
        verificada_personalizacion=False,
        verificacion_solicitada=False,
    )
    if items_para_solicitar_verificacion.exists():
        correos = CorreoAplicacion.objects.filter(
            aplicacion='CORREO_COTIZACION_COMPONENTE_VERIFICAR_ITEM_PERSONALIZADO'
        )
        usuario = User.objects.get(pk=usuario_id)
        nombre_usuario = usuario.mi_colaborador.full_name if hasattr(usuario, 'mi_colaborador') else usuario.username
        correo_from = usuario.email if usuario.email else 'noreply@odecopack.com'
        correos_to = list(correos.values_list('email', flat=True).filter(tipo='TO'))
        correos_cc = list(correos.values_list('email', flat=True).filter(tipo='CC'))
        correos_bcc = list(correos.values_list('email', flat=True).filter(tipo='BCC'))
        context = {
            "fecha": timezone.now(),
            "items_para_verificar": items_para_solicitar_verificacion.all(),
            "cotizacion": cotizacion_componente,
            "nombre_usuario": nombre_usuario,
            "dominio": request.META['HTTP_ORIGIN'],
        }
        text_content = render_to_string(
            'emails/cotizacion_componente/solicitud_verificacion_items_cotizacion.html',
            context=context
        )
        msg = EmailMultiAlternatives(
            'Verificar Items Componentes',
            text_content,
            bcc=correos_bcc,
            cc=correos_cc,
            from_email=correo_from,
            to=correos_to
        )
        msg.attach_alternative(text_content, "text/html")
        try:
            msg.send()
            items_para_solicitar_verificacion.update(
                verificacion_solicitada=True,
                verificacion_solicitada_fecha=timezone.now(),
                verificacion_solicitada_usuario=usuario
            )
        except Exception as e:
            raise ValidationError(
                {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})

        cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_id)
        return cotizacion_componente


def cotizacion_componentes_adicionar_item(
        tipo_item: str,
        cotizacion_componente_id: int,
        precio_unitario: float,
        item_descripcion: str,
        item_referencia: str,
        item_unidad_medida: str,
        tipo_transporte: str,
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
    if id_item is None:
        item.verificar_personalizacion = True
    if tipo_item == 'BandaEurobelt':
        banda_eurobelt = BandaEurobelt.objects.get(pk=id_item)
        item.banda_eurobelt = banda_eurobelt
    if tipo_item == 'ArticuloCatalogo':
        articulo_catalogo = ItemVentaCatalogo.objects.get(pk=id_item)
        if articulo_catalogo.item_sistema_informacion:
            if articulo_catalogo.item_sistema_informacion.ultimo_costo > float(precio_unitario):
                raise ValidationError({
                    '_error': 'Existe un problema de margen, por favor revisar. El costo en siesa cloud es mayor que el precio de venta unitario de la lista de precios'
                })
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
        cotizacion_componentes_item_eliminar(item_componente_id=item.id)
    return item


def cotizacion_componentes_item_personalizar_item(
        item_componente_id: int,
        caracteristica_a_cambiar: str,
        valor_string: str = None,
        valor_float: float = None,
) -> ItemCotizacionComponente:
    listado_string = ['referencia', 'descripcion', 'unidad_medida']
    listado_float = ['precio_unitario']

    if caracteristica_a_cambiar not in listado_string + listado_float:
        raise ValidationError({'_error': 'La caracteristica %s no es un atributo valido' % caracteristica_a_cambiar})

    item = ItemCotizacionComponente.objects.get(pk=item_componente_id)
    cotizacion = item.cotizacion
    if cotizacion.estado != 'INI':
        raise ValidationError({
            '_error': 'La cotización se encuentra en estado %s. Sólo las cotizacione en Edición pueden personalizar items' % cotizacion.get_estado_display()})

    if item.verificada_personalizacion:
        usuario_verificador = item.verifico_usuario.username if item.verifico_usuario else 'SIN USUARIO'
        raise ValidationError({
            '_error': 'El item ya a sido verificado por %s, ya no se puede cambiar' % usuario_verificador})

    esta_en_lista_de_precios = item.banda_eurobelt is not None or item.componente_eurobelt is not None or item.articulo_catalogo is not None

    valor_campo = getattr(item, caracteristica_a_cambiar)
    valor_nuevo = valor_string if caracteristica_a_cambiar in listado_string else valor_float
    cambia_valor = valor_campo != valor_nuevo
    es_string = valor_string is not None

    if not cambia_valor:
        return item
    else:
        setattr(item, caracteristica_a_cambiar, valor_nuevo)
        nombre_campo_ori = '%s_ori' % caracteristica_a_cambiar
        valor_campo_ori = getattr(item, nombre_campo_ori)
        guarda_original = (caracteristica_a_cambiar in listado_string and valor_campo_ori is not None) or (
                caracteristica_a_cambiar in listado_float and float(valor_campo_ori) > 0.00)

        if guarda_original:
            if (not es_string and float(valor_campo_ori) == float(valor_nuevo)) or (
                    es_string and valor_campo_ori == valor_nuevo):
                if caracteristica_a_cambiar in listado_float:
                    setattr(item, nombre_campo_ori, -1)
                elif caracteristica_a_cambiar in listado_string:
                    setattr(item, nombre_campo_ori, None)
        else:
            if esta_en_lista_de_precios:
                setattr(item, nombre_campo_ori, valor_campo)
        if caracteristica_a_cambiar == 'precio_unitario':
            item.valor_total = float(item.cantidad) * float(valor_nuevo)
    if esta_en_lista_de_precios:
        if item.referencia_ori or item.descripcion_ori or item.unidad_medida_ori or item.precio_unitario_ori != -1:
            item.verificar_personalizacion = True
        else:
            item.verificar_personalizacion = False
    item.save()
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
        cotizacion_componente_id: int,
        emails_destino: list = None,
) -> CotizacionComponente:
    cotizacion = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    if cotizacion.estado not in ['INI', 'ENV', 'REC']:
        raise ValidationError({'_error': 'No es posible enviar una cotización en estado %s' % cotizacion.estado})

    if cotizacion.nro_consecutivo is None:
        cotizacion = cotizacion_componentes_asignar_nro_consecutivo(
            cotizacion_componente_id=cotizacion.id
        )
    version = cotizacion.versiones.count() + 1

    if cotizacion.estado == 'INI':
        cotizacion = cotizacion_componentes_cambiar_estado(
            cotizacion_componente_id=cotizacion.id,
            nuevo_estado='ENV',
            usuario=request.user
        )
        cotizacion.estado = 'ENV'
        if cotizacion.responsable is None:
            if cotizacion.cliente.colaborador_componentes:
                cotizacion.responsable = cotizacion.cliente.colaborador_componentes.usuario
            else:
                cotizacion.responsable = cotizacion.creado_por
        cotizacion.save()
        filename = "%s_v%s.pdf" % (
            cotizacion.nro_consecutivo,
            version
        )
        documento = CotizacionComponenteDocumento()
        documento.cotizacion_componente = cotizacion
        documento.version = version
        documento.creado_por = request.user
        documento.save()
        output_documento = cotizacion_componentes_generar_pdf(
            cotizacion_id=cotizacion.id,
            request=request
        )
        documento.pdf_cotizacion.save(filename, File(output_documento))
        documento.save()

    context = {
        "cotizacion": cotizacion
    }
    text_content = render_to_string('emails/cotizacion_componente/cotizacion_componente.html', context=context)
    usuario_responsable = cotizacion.responsable
    email_from = 'webmaster@odecopack.com'
    email_alias = 'ODECOPACK VENTAS -'
    if usuario_responsable is not None:
        if usuario_responsable.is_active and usuario_responsable.email:
            email_from = usuario_responsable.email
            email_alias = usuario_responsable.mi_colaborador.alias_correo if hasattr(usuario_responsable,
                                                                                     'mi_colaborador') else ''
    else:
        usuario_creador = cotizacion.creado_por
        if usuario_creador is not None:
            if usuario_creador.is_active and usuario_creador.email:
                email_from = usuario_creador.email
                email_alias = usuario_creador.mi_colaborador.alias_correo if hasattr(usuario_creador,
                                                                                     'mi_colaborador') else ''

    if email_from not in emails_destino:
        emails_destino.append(email_from)

    CotizacionComponenteEnvio.objects.create(
        cotizacion_componente=cotizacion,
        archivo=cotizacion.pdf,
        creado_por=request.user,
        correo_from=email_from,
        correos_to=','.join(emails_destino),
    )

    nombre_cotizacion = 'Cotización - %s v%s' % (
        cotizacion.nro_consecutivo,
        cotizacion.pdf.version
    )
    msg = EmailMultiAlternatives(
        nombre_cotizacion,
        text_content,
        from_email='%s <%s>' % (email_alias, email_from),
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
        cotizacion_componentes_add_seguimiento(
            cotizacion_componente_id=cotizacion_componente_id,
            tipo_seguimiento='ENV',
            descripcion='Envío de correo para %s desde %s' % (emails_destino, email_from),
            creado_por=request.user,
            fecha=timezone.now(),
            pdf_cotizacion_id=cotizacion.pdf.id
        )
    except Exception as e:
        raise ValidationError(
            {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    cotizacion = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
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


def cotizacion_componentes_add_seguimiento(
        cotizacion_componente_id: int,
        tipo_seguimiento: str,
        descripcion: str,
        creado_por: User,
        fecha: datetime = timezone.now(),
        pdf_cotizacion_id: int = None
) -> CotizacionComponenteSeguimiento:
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    # if cotizacion_componente.estado not in ['ENV', 'REC', 'ELI', 'PRO']:
    #     raise ValidationError({
    #         '_error': 'No se puede realizar seguimiento a una cotización en estado %s' % cotizacion_componente.get_estado_display()})
    seguimiento = CotizacionComponenteSeguimiento()
    seguimiento.cotizacion_componente_id = cotizacion_componente_id
    seguimiento.tipo_seguimiento = tipo_seguimiento
    seguimiento.descripcion = descripcion
    seguimiento.fecha = fecha
    seguimiento.creado_por = creado_por
    seguimiento.documento_cotizacion_id = pdf_cotizacion_id
    seguimiento.save()
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
