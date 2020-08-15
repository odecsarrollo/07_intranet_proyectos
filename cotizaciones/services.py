import datetime

from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.db.models import Max
from django.db.models.functions import Substr
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from reversion.models import Version

from clientes.models import ClienteBiable
from correos_servicios.models import CorreoAplicacion
from cotizaciones.models import CondicionInicioProyecto
from cotizaciones.models import CondicionInicioProyectoCotizacion
from proyectos.models import Literal
from proyectos.models import Proyecto
from .models import ArchivoCotizacion
from .models import Cotizacion
from .models import CotizacionPagoProyectado
from .models import CotizacionPagoProyectadoAcuerdoPago
from .models import CotizacionPagoProyectadoAcuerdoPagoPago
from .models import SeguimientoCotizacion


def condicion_inicio_proyecto_crear_actualizar(
        descripcion: str,
        condicion_especial: bool,
        require_documento: bool,
        condicion_inicio_proyecto_id: int = None,
) -> CondicionInicioProyecto:
    if condicion_inicio_proyecto_id is not None:
        condicion_inicio_proyecto = CondicionInicioProyecto.objects.get(pk=condicion_inicio_proyecto_id)
    else:
        condicion_inicio_proyecto = CondicionInicioProyecto()
    condicion_inicio_proyecto.descripcion = descripcion
    if condicion_especial and CondicionInicioProyecto.objects.filter(condicion_especial=True).exists():
        raise ValidationError({'_error': 'Sólo puede existir una condición de inicio de tipo condicion especial'})
    condicion_inicio_proyecto.condicion_especial = condicion_especial
    condicion_inicio_proyecto.require_documento = require_documento
    condicion_inicio_proyecto.save()
    return condicion_inicio_proyecto


def cotizacion_versions(cotizacion_id: int) -> Version:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    versions = Version.objects.get_for_object(cotizacion)
    return versions


def cotizacion_envio_correo_notificacion_condiciones_inicio_completas(
        cotizacion_id: int
) -> Cotizacion:
    cotizacion = Cotizacion.objects.prefetch_related(
        'pagos_proyectados',
        'condiciones_inicio_cotizacion'
    ).get(pk=cotizacion_id)
    correos = CorreoAplicacion.objects.filter(aplicacion='CORREO_COTIZACION_NOTIFICACION_INICIO')
    correo_from = correos.filter(tipo='FROM').first()

    correos_to = list(correos.values_list('email', flat=True).filter(tipo='TO'))
    if cotizacion.responsable and cotizacion.responsable.email:
        correos_to.append(cotizacion.responsable.email)
    correos_cc = list(correos.values_list('email', flat=True).filter(tipo='CC'))
    correos_bcc = list(correos.values_list('email', flat=True).filter(tipo='BCC'))
    asunto = 'Solicitud apertura para Cotizacion %s-%s' % (cotizacion.unidad_negocio, cotizacion.nro_cotizacion)
    es_adicional = cotizacion.cotizacion_inicial is not None
    asunto = asunto if not es_adicional else 'Notificación de cotización adicional %s-%s' % (
        cotizacion.unidad_negocio, cotizacion.nro_cotizacion)
    context = {
        "cotizacion_inicial": '%s-%s' % (cotizacion.cotizacion_inicial.unidad_negocio,
                                         cotizacion.cotizacion_inicial.nro_cotizacion) if cotizacion.cotizacion_inicial else '',
        "cotizacion": cotizacion,
        "pagos_proyectados": cotizacion.pagos_proyectados.all(),
        "condiciones_inicio_cotizacion": cotizacion.condiciones_inicio_cotizacion.order_by('fecha_entrega').all()
    }
    text_content = render_to_string('emails/cotizacion_proyecto/correo_notificacion_venta_proyectos.html',
                                    context=context)
    msg = EmailMultiAlternatives(
        asunto,
        text_content,
        cc=correos_cc,
        bcc=correos_bcc,
        from_email='%s <%s>' % (
            correo_from.alias_from, correo_from.email) if correo_from else 'noreply@odecopack.com',
        to=correos_to if len(correos_to) > 0 else ['fabio.garcia.sanchez@gmail.com']
    )
    msg.attach_alternative(text_content, "text/html")
    pagos_proyectados = cotizacion.pagos_proyectados
    if pagos_proyectados.exists():
        for oc in pagos_proyectados.all():
            if hasattr(oc, 'orden_compra_documento'):
                nombre_archivo = '%s%s %s.%s' % (
                    cotizacion.unidad_negocio, cotizacion.nro_cotizacion,
                    'Orden Compra', oc.orden_compra_documento.archivo.name.split('.')[-1])
                msg.attach(nombre_archivo, oc.orden_compra_documento.archivo.read())

    documentos_para_enviar = cotizacion.condiciones_inicio_cotizacion.filter(require_documento=True)
    for condicion in documentos_para_enviar.all():
        if condicion.documento:
            nombre_archivo = '%s%s %s.%s' % (
                cotizacion.unidad_negocio, cotizacion.nro_cotizacion,
                condicion.descripcion, condicion.documento.name.split('.')[-1])
            msg.attach(nombre_archivo, condicion.documento.read())
    try:
        msg.send()
    except Exception as e:
        raise ValidationError(
            {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    try:
        nombre_colaborador = '%s' % cotizacion.responsable.colaborador.full_name if hasattr(
            cotizacion.responsable,
            'colaborador'
        ) else '%s' % cotizacion.responsable.username
        from intranet_proyectos.services import send_sms
        send_sms(
            phone_number='+573155476246',
            message='Venta Proyectos: %s / %s / %s por %s' % (
                nombre_colaborador,
                cotizacion.descripcion_cotizacion,
                cotizacion.cliente.nombre,
                "${:,.0f}".format(cotizacion.valor_ofertado).replace('.', '_').replace(',', '.').replace('_',
                                                                                                         ',')
            )
        )
    except Exception as e:
        raise ValidationError(
            {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    return cotizacion


def cotizacion_verificar_condicion_inicio_proyecto_si_estan_completas(
        cotizacion_id: int
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    ordenes_compra = cotizacion.pagos_proyectados
    condiciones_incompletas = cotizacion.condiciones_inicio_cotizacion.filter(fecha_entrega__isnull=True)
    condicion_especial = cotizacion.condiciones_inicio_cotizacion.filter(
        condicion_especial=True,
        fecha_entrega__isnull=False
    )
    if condicion_especial.exists():
        if cotizacion.estado == 'Cierre (Aprobado)':
            return cotizacion
        cotizacion.condiciones_inicio_completas = True
        cotizacion.condiciones_inicio_fecha_ultima = condicion_especial.first().fecha_entrega
        cotizacion.estado = 'Cierre (Aprobado)'
        cotizacion.fecha_cambio_estado_cerrado = timezone.now()
        cotizacion.save()
        cotizacion_envio_correo_notificacion_condiciones_inicio_completas(cotizacion.id)
    elif not condiciones_incompletas.exists() and ordenes_compra.exists():
        if cotizacion.estado == 'Cierre (Aprobado)':
            return cotizacion
        fecha_max = cotizacion.condiciones_inicio_cotizacion.aggregate(fecha_max=Max('fecha_entrega'))['fecha_max']
        fecha_max_oc = cotizacion.pagos_proyectados.aggregate(fecha_max=Max('orden_compra_fecha'))['fecha_max']
        cotizacion.condiciones_inicio_fecha_ultima = max(fecha_max_oc, fecha_max) if fecha_max else fecha_max_oc
        cotizacion.condiciones_inicio_completas = True
        cotizacion.estado = 'Cierre (Aprobado)'
        cotizacion.fecha_cambio_estado_cerrado = timezone.now()
        cotizacion.save()
        cotizacion_envio_correo_notificacion_condiciones_inicio_completas(cotizacion.id)
    else:
        cotizacion.fecha_cambio_estado_cerrado = None
        cotizacion.condiciones_inicio_fecha_ultima = None
        cotizacion.condiciones_inicio_completas = False
        cotizacion.save()
    return cotizacion


def cotizacion_cambiar_fecha_proximo_seguimiento(
        cotizacion_id: int,
        fecha_limite_segumiento_estado: datetime,
        usuario: User
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    if not (cotizacion.responsable == usuario or usuario.is_superuser):
        raise ValidationError({
            '_error': 'Sólo el responsable de la cotización (%s) o el administrador del sistema pueden cambiar la fecha de verificación del próximo seguimiento' % cotizacion.responsable})

    cotizacion.fecha_cambio_estado = timezone.now().date()
    cotizacion.fecha_limite_segumiento_estado = datetime.datetime.strptime(fecha_limite_segumiento_estado, "%Y-%m-%d")
    cotizacion.save()
    return cotizacion


def condicion_inicio_proyecto_cotizacion_actualizar(
        condicion_inicio_cotizacion_id: int,
        fecha_entrega: datetime.date,
        documento
) -> CondicionInicioProyectoCotizacion:
    condicion_inicio_proyecto_cotizacion = CondicionInicioProyectoCotizacion.objects.get(
        pk=condicion_inicio_cotizacion_id)
    condicion_inicio_proyecto_cotizacion.fecha_entrega = fecha_entrega
    condicion_inicio_proyecto_cotizacion.documento = documento
    condicion_inicio_proyecto_cotizacion.save()
    cotizacion_verificar_condicion_inicio_proyecto_si_estan_completas(
        cotizacion_id=condicion_inicio_proyecto_cotizacion.cotizacion_proyecto.id)
    return condicion_inicio_proyecto_cotizacion


def cotizacion_add_pago_proyectado(
        cotizacion_id: int,
        orden_compra_nro: str,
        valor_orden_compra: float,
        orden_compra_fecha: datetime,
        orden_compra_archivo,
        user_id: int,
        no_enviar_correo=False
) -> CotizacionPagoProyectado:
    orden_compra = CotizacionPagoProyectado.objects.create(
        orden_compra_nro=orden_compra_nro,
        valor_orden_compra=valor_orden_compra,
        orden_compra_fecha=orden_compra_fecha,
        cotizacion_id=cotizacion_id,
        creado_por_id=user_id
    )
    ArchivoCotizacion.objects.create(
        cotizacion_id=orden_compra.cotizacion_id,
        orden_compra_id=orden_compra.id,
        creado_por_id=user_id,
        tipo='ORDENCOMPRA',
        archivo=orden_compra_archivo,
        nombre_archivo='OC_%s' % orden_compra.orden_compra_nro
    )

    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)

    correos = CorreoAplicacion.objects.filter(aplicacion='CORREO_COTIZACION_NUEVA_OC')
    correo_from = correos.filter(tipo='FROM').first()
    correos_to = list(correos.values_list('email', flat=True).filter(tipo='TO'))
    correos_cc = list(correos.values_list('email', flat=True).filter(tipo='CC'))
    correos_bcc = list(correos.values_list('email', flat=True).filter(tipo='BCC'))
    if len(correos_to) > 0 or len(correos_cc) > 0 or len(correos_bcc) > 0:
        asunto = 'Nueva Orden de Compra'
        context = {
            "cotizacion": cotizacion,
            "orden_compra": orden_compra
        }
        text_content = render_to_string(
            'emails/cotizacion_proyecto/correo_notificacion_nueva_orden_compra.html',
            context=context
        )
        msg = EmailMultiAlternatives(
            asunto,
            text_content,
            cc=correos_cc,
            bcc=correos_bcc,
            from_email='%s <%s>' % (
                correo_from.alias_from, correo_from.email) if correo_from else 'noreply@odecopack.com',
            to=correos_to if len(correos_to) > 0 else ['fabio.garcia.sanchez@gmail.com']
        )
        msg.attach_alternative(text_content, "text/html")
        if orden_compra.orden_compra_documento:
            nombre_archivo = '%s%s %s.%s' % (
                cotizacion.unidad_negocio, cotizacion.nro_cotizacion,
                'orden_compra', orden_compra.orden_compra_documento.archivo.name.split('.')[-1])
            msg.attach(nombre_archivo, orden_compra.orden_compra_documento.archivo.read())
        try:
            if not no_enviar_correo:  # Cuidamos no volver a enviar por correo cuando se duplique una oc vieja al modelo nuevo
                msg.send()
            orden_compra.notificada_por_correo = True
            orden_compra.save()
        except Exception as e:
            raise ValidationError(
                {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    cotizacion_verificar_condicion_inicio_proyecto_si_estan_completas(cotizacion_id=cotizacion_id)
    return orden_compra


def cotizacion_add_pago(
        cotizacion_id: int,
        valor: float,
        fecha: datetime,
        comprobante_pago,
        acuerdo_pago_id: int,
        user_id: int
) -> CotizacionPagoProyectado:
    pago = None
    acuerdo_pago = CotizacionPagoProyectadoAcuerdoPago.objects.get(pk=acuerdo_pago_id)
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    if acuerdo_pago.orden_compra.cotizacion_id == cotizacion_id:
        pago = CotizacionPagoProyectadoAcuerdoPagoPago.objects.create(
            valor=valor,
            comprobante_pago=comprobante_pago,
            fecha=fecha,
            acuerdo_pago_id=acuerdo_pago_id,
            creado_por_id=user_id
        )

    correos = CorreoAplicacion.objects.filter(aplicacion='CORREO_COTIZACION_REGISTRO_NUEVO_PAGO')
    correo_from = correos.filter(tipo='FROM').first()
    correos_to = list(correos.values_list('email', flat=True).filter(tipo='TO'))
    correos_cc = list(correos.values_list('email', flat=True).filter(tipo='CC'))
    correos_bcc = list(correos.values_list('email', flat=True).filter(tipo='BCC'))
    if len(correos_to) > 0 or len(correos_cc) > 0 or len(correos_bcc) > 0:
        if cotizacion.responsable and cotizacion.responsable.email:
            correos_to.append(cotizacion.responsable.email)
        asunto = 'Nueva Orden de Compra'
        context = {
            "cotizacion": cotizacion,
            "pago": pago
        }
        text_content = render_to_string(
            'emails/cotizacion_proyecto/correo_notificacion_registro_pago.html',
            context=context
        )
        msg = EmailMultiAlternatives(
            asunto,
            text_content,
            cc=correos_cc,
            bcc=correos_bcc,
            from_email='%s <%s>' % (
                correo_from.alias_from, correo_from.email) if correo_from else 'noreply@odecopack.com',
            to=correos_to if len(correos_to) > 0 else ['fabio.garcia.sanchez@gmail.com']
        )
        msg.attach_alternative(text_content, "text/html")
        if pago.comprobante_pago:
            nombre_archivo = '%s%s %s.%s' % (
                cotizacion.unidad_negocio, cotizacion.nro_cotizacion,
                'orden_compra', pago.comprobante_pago.name.split('.')[-1])
            msg.attach(nombre_archivo, pago.comprobante_pago.read())
        try:
            msg.send()
            pago.notificada_por_correo = True
            pago.save()
        except Exception as e:
            raise ValidationError(
                {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    return pago


def archivo_cotizacion_eliminar(
        archivo_cotizacion_id: int,
        user_id: int
):
    archivo_cotizacion = ArchivoCotizacion.objects.get(pk=archivo_cotizacion_id)
    user = User.objects.get(pk=user_id)
    if archivo_cotizacion.tipo == 'ORDENCOMPRA':
        raise ValidationError(
            {
                '_error': 'Los archivos de tipo %s no se pueden eliminar por este medio' % archivo_cotizacion.get_tipo_display()})
    if archivo_cotizacion.tipo == 'COTIZACION':
        puede_eliminar = user.has_perm('cotizaciones.delete_tipo_cotizacion_archivocotizacion')
        if not puede_eliminar:
            raise ValidationError(
                {
                    '_error': 'No tiene permiso para eliminar archivos de tipo %s' % archivo_cotizacion.get_tipo_display()})

        documentos_cotizacion = ArchivoCotizacion.objects.exclude(
            pk=archivo_cotizacion_id
        ).filter(
            cotizacion_id=archivo_cotizacion.cotizacion_id,
            tipo='COTIZACION'
        )
        if not documentos_cotizacion.exists():
            raise ValidationError(
                {
                    '_error': 'Para eliminar debe existir al menos 2 documentos tipo %s. Cree uno nuevo y elimine el que no desee' % archivo_cotizacion.get_tipo_display()})
    archivo_cotizacion.delete()


def cotizacion_eliminar_pago(
        cotizacion_id: int,
        pago_id: int,
        user_id: int
):
    pago = CotizacionPagoProyectadoAcuerdoPagoPago.objects.get(pk=pago_id)
    user = User.objects.get(pk=user_id)
    puede_eliminar_siempre = user.has_perm('cotizaciones.delete_cotizacionpagoproyectadoacuerdopagopago_siempre')

    if pago.acuerdo_pago.orden_compra.cotizacion_id == int(cotizacion_id):
        if not puede_eliminar_siempre:
            fecha_creacion: datetime = pago.created
            ahora = timezone.make_aware(datetime.datetime.now())
            diferencia = (ahora - fecha_creacion)
            minutos = diferencia.seconds / 60
            if minutos < 10:
                raise ValidationError(
                    {'_error': 'Sólo alguien con permisos de eliminar pagos siempre puede eliminar este pago'})
            if pago.creado_por_id != user_id:
                raise ValidationError(
                    {'_error': 'Sólo lo puede borrar el usuario quien lo creo este pago %s' % (
                        pago.creado_por.username)})
            pago.delete()
        else:
            pago.delete()


def cotizacion_eliminar_pago_proyectado(
        cotizacion_id: int,
        pago_proyectado_id: int,
        user_id: int
):
    user = User.objects.get(pk=user_id)
    pago_proyectado = CotizacionPagoProyectado.objects.get(pk=pago_proyectado_id)
    puede_eliminar = user.has_perm('cotizaciones.delete_cotizacionpagoproyectado')
    if not puede_eliminar:
        raise ValidationError(
            {
                '_error':
                    'No tiene permiso para eliminar Ordens de Compra'
            }
        )
    if pago_proyectado.cotizacion_id == int(cotizacion_id):
        if not CotizacionPagoProyectadoAcuerdoPagoPago.objects.filter(
                acuerdo_pago__orden_compra_id=pago_proyectado_id
        ).exists():
            pago_proyectado.orden_compra_documento.delete()
            pago_proyectado.delete()
            cotizacion_limpiar_condicion_inicio_proyecto(cotizacion_id=cotizacion_id)
        else:
            raise ValidationError(
                {
                    '_error':
                        'No es posible eliminar esta orden de compra porque tiene información relacionada'
                }
            )


def cotizacion_limpiar_condicion_inicio_proyecto(
        cotizacion_id: int,
        condicion_inicio_proyecto_id: int = None,
        es_orden_compra: bool = False
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    if condicion_inicio_proyecto_id is not None:
        condiciones_inicio_cotizaciones = cotizacion.condiciones_inicio_cotizacion.filter(
            condicion_inicio_proyecto_id=condicion_inicio_proyecto_id)
        for condicion_inicio in condiciones_inicio_cotizaciones.all():
            condicion_inicio.fecha_entrega = None
            condicion_inicio.documento = None
            condicion_inicio.save()
    con_condicion_especial = cotizacion.condiciones_inicio_cotizacion.filter(
        condicion_especial=True,
        fecha_entrega__isnull=False
    ).exists()
    con_pagos_proyectados = cotizacion.pagos_proyectados.exists()
    if not con_condicion_especial and not con_pagos_proyectados:
        cotizacion.condiciones_inicio_completas = False
        cotizacion.condiciones_inicio_fecha_ultima = None
        cotizacion.fecha_cambio_estado_cerrado = None
        if cotizacion.estado == 'Cierre (Aprobado)':
            cotizacion.estado = 'Aceptación de Terminos y Condiciones'
    cotizacion.save()
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    return cotizacion


def cotizacion_adicionar_quitar_condicion_inicio_proyecto(
        tipo_accion,
        cotizacion_id: int,
        condicion_inicio_proyecto_id: int
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    condicion_inicio_cotizacion = CondicionInicioProyectoCotizacion.objects.filter(
        condicion_inicio_proyecto_id=condicion_inicio_proyecto_id,
        cotizacion_proyecto_id=cotizacion_id)
    if tipo_accion == 'del' and condicion_inicio_cotizacion.exists():
        [c.delete() for c in condicion_inicio_cotizacion.all()]
        cotizacion = cotizacion_verificar_condicion_inicio_proyecto_si_estan_completas(cotizacion_id=cotizacion.id)
    if tipo_accion == 'add' and not condicion_inicio_cotizacion.exists():
        condicion_inicio_proyecto = CondicionInicioProyecto.objects.get(pk=condicion_inicio_proyecto_id)
        condicion_proyecto = CondicionInicioProyectoCotizacion()
        condicion_proyecto.condicion_inicio_proyecto_id = condicion_inicio_proyecto_id
        condicion_proyecto.descripcion = condicion_inicio_proyecto.descripcion
        condicion_proyecto.require_documento = condicion_inicio_proyecto.require_documento
        condicion_proyecto.condicion_especial = condicion_inicio_proyecto.condicion_especial
        condicion_proyecto.cotizacion_proyecto = cotizacion
        condicion_proyecto.save()
        cotizacion.condiciones_inicio_completas = False
        cotizacion.condiciones_inicio_fecha_ultima = None
        cotizacion.fecha_cambio_estado_cerrado = None
        if cotizacion.estado != 'Aceptación de Terminos y Condiciones':
            raise ValidationError({
                '_error': 'No se puede adicionar condiciones de inicio a una cotizacion en estado diferente a Aceptación de Terminos y Condiciones'})
    cotizacion.save()
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    return cotizacion


def cotizacion_crear(
        created_by_id: User,
        unidad_negocio: str,
        descripcion_cotizacion: str,
        origen_cotizacion: str,
        fecha_entrega_pactada_cotizacion: datetime,
        contacto_cliente_id: int,
        cliente_id: int,
        observacion: str = None,
        cotizacion_inicial_id: int = None,
) -> Cotizacion:
    cotizacion = Cotizacion()
    if unidad_negocio == 'ADI':
        if cotizacion_inicial_id is None:
            raise ValidationError(
                {'_error': 'Una cotización adicional debe tener una inicial obligatoriamente'})
        else:
            cotizacion_inicial = Cotizacion.objects.get(pk=cotizacion_inicial_id)
            if cotizacion_inicial.unidad_negocio == 'ADI':
                raise ValidationError(
                    {'_error': 'Una cotización inicial no puede ser otra adicional'})

            elif cotizacion_inicial.estado != 'Cierre (Aprobado)':
                raise ValidationError(
                    {'_error': 'La cotización inicial debe de estar en estado Cierre (Aprobado)'})
            cotizacion.cotizacion_inicial_id = cotizacion_inicial_id

            if cotizacion_inicial.cliente_id != cliente_id:
                raise ValidationError({
                    '_error': 'El cliente de una cotizacion adicional no puede ser diferente al cliente de la inicial'})

    if cliente_id is None or contacto_cliente_id is None:
        raise ValidationError(
            {'_error': 'La cotización debe tener cliente y contacto'})

    cliente = ClienteBiable.objects.get(pk=cliente_id)
    contactos = cliente.contactos.filter(pk=contacto_cliente_id)
    if not contactos.exists():
        raise ValidationError(
            {'_error': 'El contacto seleccionado no existe para el cliente elegido'})

    cotizacion.created_by_id = created_by_id
    cotizacion.fecha_limite_segumiento_estado = timezone.now().date()
    cotizacion.unidad_negocio = unidad_negocio
    cotizacion.descripcion_cotizacion = descripcion_cotizacion
    cotizacion.observacion = observacion
    cotizacion.origen_cotizacion = origen_cotizacion
    cotizacion.fecha_cambio_estado = timezone.now().date()
    cotizacion.cliente_id = cliente_id
    cotizacion.contacto_cliente_id = contacto_cliente_id
    cotizacion.responsable_id = created_by_id
    cotizacion.fecha_entrega_pactada_cotizacion = fecha_entrega_pactada_cotizacion
    cotizacion.estado = 'Cita/Generación Interés'
    cotizacion.save()
    SeguimientoCotizacion.objects.create(
        cotizacion=cotizacion,
        tipo_seguimiento=1,
        creado_por_id=created_by_id,
        estado=cotizacion.estado
    )
    return cotizacion


def cotizacion_actualizar(
        modified_by_id: User,
        unidad_negocio: str,
        descripcion_cotizacion: str,
        origen_cotizacion: str,
        fecha_entrega_pactada_cotizacion: datetime,
        fecha_limite_segumiento_estado: datetime,
        cotizacion_id: int,
        estado: str,
        responsable_id: int,
        cliente_id: int,
        contacto_cliente_id: int,
        observacion: str = None,
        valor_ofertado: float = None,
        costo_presupuestado: float = None,
        estado_observacion_adicional: str = None,
        dias_pactados_entrega_proyecto: int = None,
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    cambio_estado = estado != cotizacion.estado
    cambio_cliente = cliente_id != cotizacion.cliente_id
    tiene_cotizaciones_adicionales = cotizacion.cotizaciones_adicionales.exists()
    tiene_proyectos = cotizacion.proyectos.exists()

    if unidad_negocio == 'ADI' and cambio_cliente:
        raise ValidationError(
            {
                '_error': 'No se puede cambiar el cliente porque la cotización inicial no puede tener un cliente diferente al de las cotizaciones adicionales'})
    elif (tiene_cotizaciones_adicionales or tiene_proyectos) and cambio_cliente:
        raise ValidationError(
            {'_error': 'No se puede cambiar el cliente si se tiene proyectos o cotizaciones adicionales relacionadas'})

    # Valida que no se vaya a cambiar de estado de Cierre (Aprobado) si tiene cotizaciones adicionales o proyectos vinculados
    if cotizacion.estado == 'Cierre (Aprobado)' and cambio_estado:
        if tiene_cotizaciones_adicionales or tiene_proyectos:
            raise ValidationError(
                {
                    '_error': 'Para cambiar una cotización cuyo estado es %s a %s no deben haber cotizaciones adicionales relacionadas ni proyectos relacionados' % (
                        cotizacion.estado, estado)})

    cotizacion.estado = estado
    # Valida que al cambiar el cliente o contacto, el contacto pertenezca al cliente definido

    cliente = ClienteBiable.objects.get(pk=cliente_id)
    contactos = cliente.contactos.filter(pk=contacto_cliente_id)
    if not contactos.exists():
        raise ValidationError(
            {'_error': 'El contacto seleccionado no existe para el cliente elegido'})
    else:
        cotizacion.cliente_id = cliente_id
        cotizacion.contacto_cliente_id = contacto_cliente_id
        for proyecto in cotizacion.proyectos.all():
            proyecto.cliente_id = cliente_id
            proyecto.save()

    # Valida que una cotizacion ADI no se pueda cambiar en ningún otro tipo de cotización y viceversa
    cambio_unidad_de_negocio = cotizacion.unidad_negocio != unidad_negocio
    if (cotizacion.unidad_negocio == 'ADI' or unidad_negocio == 'ADI') and cambio_unidad_de_negocio:
        raise ValidationError(
            {'_error': 'No se puede cambiar la unidad de negocio %s a %s' % (
                cotizacion.unidad_negocio, unidad_negocio)})
    else:
        cotizacion.unidad_negocio = unidad_negocio

    if estado in ['Aplazado', 'Cancelado', 'Evaluación Técnica y Económica']:
        if estado_observacion_adicional is None:
            raise ValidationError({
                '_error': 'Una cotización en estado %s debe tener una observación del estado' % cotizacion.estado})
        cotizacion.estado_observacion_adicional = estado_observacion_adicional
    else:
        cotizacion.estado_observacion_adicional = None

    if estado in [
        'Cotización Enviada',
        'Evaluación Técnica y Económica',
        'Aceptación de Terminos y Condiciones',
        'Cierre (Aprobado)'
    ]:
        if valor_ofertado is None or valor_ofertado <= 0:
            raise ValidationError(
                {'_error': 'Para el estado de %s es necesario tener un valor ofertado' % estado})
        cotizacion.valor_ofertado = valor_ofertado
        if costo_presupuestado is None or costo_presupuestado <= 0:
            raise ValidationError({
                '_error': 'Para el estado de Aceptación de Terminos y Condiciones es necesario tener un costo presupuestado del proyecto'})
        else:
            cotizacion.costo_presupuestado = costo_presupuestado
    else:
        cotizacion.valor_ofertado = 0
        cotizacion.costo_presupuestado = 0

    # Valida cuándo se puede crear un número de cotización
    if estado not in ['Aplazado', 'Cancelado', 'Cita/Generación Interés']:
        if cotizacion.nro_cotizacion is None:
            cotizacion.nro_cotizacion = cotizacion_generar_numero_cotizacion()

    if cambio_estado:
        cotizacion.fecha_cambio_estado = timezone.now().date()

    if estado in ['Aceptación de Terminos y Condiciones', 'Cierre (Aprobado)']:
        if dias_pactados_entrega_proyecto is None or dias_pactados_entrega_proyecto <= 0:
            raise ValidationError({
                '_error': 'Para el estado de %s es necesario tener unos días pactados de entrega del proyectos' % (
                    estado)})
        else:
            cotizacion.dias_pactados_entrega_proyecto = dias_pactados_entrega_proyecto
        cotizacion.save()

        if estado == 'Aceptación de Terminos y Condiciones':
            cotizacion = cotizacion_verificar_condicion_inicio_proyecto_si_estan_completas(cotizacion_id=cotizacion_id)
    else:
        cotizacion.dias_pactados_entrega_proyecto = None

    cotizacion.responsable_id = responsable_id
    cotizacion.descripcion_cotizacion = descripcion_cotizacion
    cotizacion.observacion = observacion
    cotizacion.origen_cotizacion = origen_cotizacion
    cotizacion.fecha_entrega_pactada_cotizacion = fecha_entrega_pactada_cotizacion
    cotizacion.fecha_limite_segumiento_estado = fecha_limite_segumiento_estado
    cotizacion.save()
    if cambio_estado:
        SeguimientoCotizacion.objects.create(
            cotizacion=cotizacion,
            tipo_seguimiento=1,
            creado_por_id=modified_by_id,
            estado=cotizacion.estado
        )

    return cotizacion


def cotizacion_convertir_en_adicional(
        cotizacion_id: int,
        cotizacion_inicial_id: int
) -> Cotizacion:
    estado_permitido = ['Aceptación de Terminos y Condiciones', 'Cierre (Aprobado)']
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    cotizacion_inicial = Cotizacion.objects.get(pk=cotizacion_inicial_id)
    if cotizacion_inicial.estado not in estado_permitido:
        raise ValidationError({
            '_error': 'La cotización que se pretende poner adicional esta en estado %s y por ende no puede ser inicial' % (
                cotizacion_inicial.estado)})

    if cotizacion.estado not in estado_permitido:
        raise ValidationError({
            '_error': 'La cotización que se pretende volver adicional esta en estado %s y por ende no puede ser adicional' % (
                cotizacion.estado)})

    if cotizacion.cotizacion_inicial:
        raise ValidationError({'_error': 'Ya es una cotización adicional'})
    if cotizacion_inicial.cotizacion_inicial:
        raise ValidationError(
            {'_error': 'No se puede relacionar como cotización inicial a una que sea adicional'})
    if cotizacion.cliente_id != cotizacion_inicial.cliente_id:
        raise ValidationError(
            {'_error': 'Los clientes de las dos cotizaciones son diferentes, validar que sean iguales'})
    proyectos_cotizacion = cotizacion.proyectos
    if cotizacion.proyectos.exists():
        for proyecto in proyectos_cotizacion.all():
            cotizacion.proyectos.remove(proyecto)
            cotizacion_inicial.proyectos.add(proyecto)
    cotizaciones_adicionales_cotizacion = cotizacion.cotizaciones_adicionales
    if cotizaciones_adicionales_cotizacion.exists():
        for cotizacion_adicional in cotizaciones_adicionales_cotizacion.all():
            cotizacion.cotizaciones_adicionales.remove(cotizacion_adicional)
            cotizacion_inicial.cotizaciones_adicionales.add(cotizacion_adicional)
    cotizacion.cotizacion_inicial = cotizacion_inicial
    cotizacion.save()
    return cotizacion


def cotizacion_quitar_relacionar_literal(
        cotizacion_id: int,
        literal_id: int
) -> Cotizacion:
    cotizacion_adicional = Cotizacion.objects.get(pk=cotizacion_id)
    tiene_literal = cotizacion_adicional.literales.filter(pk=literal_id).exists()
    elimina = False
    if tiene_literal:
        elimina = True
        cotizacion_adicional.literales.remove(literal_id)
    else:
        cotizacion_inicial = cotizacion_adicional.cotizacion_inicial
        es_cotizacion_adicional = cotizacion_inicial is not None
        literal = Literal.objects.get(pk=literal_id)
        proyecto = literal.proyecto
        if not es_cotizacion_adicional:
            raise ValidationError(
                {'_error': 'Sólo una cotización adicional se puede vincular a un literal'})

        cotizacion_tiene_proyecto = cotizacion_inicial.proyectos.filter(pk=proyecto.id).exists()
        if not cotizacion_tiene_proyecto:
            raise ValidationError(
                {'_error': 'El proyecto del literal no esta relacionado con la cotizacion inicial'})
        cotizacion_adicional.literales.add(literal_id)
    cotizacion_envio_correo_relacionar_literal(
        literal_id=literal_id,
        cotizacion_id=cotizacion_id,
        elimina=elimina
    )
    cotizacion_adicional = Cotizacion.objects.get(pk=cotizacion_id)
    return cotizacion_adicional


def cotizacion_quitar_relacionar_proyecto(
        cotizacion_id: int,
        proyecto_id: int
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    es_cotizacion_adicional = cotizacion.cotizacion_inicial is not None
    if es_cotizacion_adicional:
        raise ValidationError(
            {'_error': 'Las cotizaciones de tipo adicional no pueden tener proyectos relacionados'})
    if cotizacion.cotizacion_inicial is not None:
        raise ValidationError(
            {
                '_error': 'La cotización ya esta relacionada con otra anterior, quien ya tiene una relación con un proyecto. No es necesario relacionar de nuevo'})
    if cotizacion.estado != 'Cierre (Aprobado)':
        raise ValidationError(
            {'_error': 'La cotización debe de estar en estado cerrado para poder relacionarle un proyecto.'})

    proyecto = Proyecto.objects.get(pk=proyecto_id)
    if cotizacion.proyectos.filter(pk=proyecto_id).exists():
        literales = Cotizacion.objects.filter(cotizacion_inicial=cotizacion, literales__proyecto__id=proyecto_id)
        if not literales.exists():
            cotizacion.proyectos.remove(proyecto_id)
            proyecto.cliente = None
            proyecto.save()
            cotizacion_envio_correo_relacionar_proyecto(
                cotizacion_id=cotizacion_id,
                proyecto_id=proyecto_id,
                elimina=True
            )
        else:
            raise ValidationError(
                {
                    '_error': 'El proyecto %s no se puede desvincular porque tiene literales relacionados con una cotización adicional de la actual cotización' % proyecto.id_proyecto})
    else:
        if cotizacion.estado == 'Cierre (Aprobado)':
            if not proyecto.cotizaciones.exists():
                cotizacion.proyectos.add(proyecto_id)
                proyecto.cliente = cotizacion.cliente
                proyecto.save()
                cotizacion_envio_correo_relacionar_proyecto(
                    cotizacion_id=cotizacion_id,
                    proyecto_id=proyecto_id,
                    elimina=False
                )
            else:
                raise ValidationError(
                    {
                        '_error': 'El proyecto %s ya tiene una cotizacion inicial relacionada, no se pueden relacionar más de una a un proyecto' % proyecto.id_proyecto})
        else:
            raise ValidationError(
                {'_error': 'Solo se pueden relacionar proyectos a cotizaciones que se encuentren en estado de Cierre'})

    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    if cotizacion.proyectos.count() > 0:
        cotizacion.relacionada = True
        cotizacion.revisada = True
    else:
        cotizacion.relacionada = False
        cotizacion.revisada = False
    cotizacion.save()
    return cotizacion


def cotizacion_set_revisado(
        cotizacion_id: int
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    cotizacion.revisada = True
    cotizacion.save()
    return cotizacion


def cotizacion_generar_numero_cotizacion() -> int:
    now = datetime.datetime.now()
    ano = abs(int(now.year) % 100)
    mes = abs(int(now.month))
    base_nro_cotizacion = ano * 1000000
    cotizaciones = Cotizacion.objects.filter(
        nro_cotizacion__isnull=False,
        nro_cotizacion__gte=base_nro_cotizacion
    )
    ultimo_indice = 1
    if cotizaciones.exists():
        cotizaciones = cotizaciones.annotate(
            nro_cot=Substr('nro_cotizacion', 5, 4)
        ).aggregate(Max('nro_cot'))
        ultimo_indice = int(cotizaciones['nro_cot__max']) + 1
    mes = '%s%s' % ('0', mes) if mes < 10 else mes
    nuevo_nro_cotizacion = (int('%s%s' % (ano, mes)) * 10000) + ultimo_indice

    return nuevo_nro_cotizacion


def cotizacion_envio_correo_relacionar_proyecto(
        cotizacion_id: int,
        proyecto_id: int,
        elimina=False
) -> None:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    proyecto = Proyecto.objects.get(pk=proyecto_id)

    correo_to = cotizacion.responsable.email
    correo_from = 'noreply@odecopack.com'
    if correo_to is not None:
        context = {
            "cotizacion": cotizacion,
            "proyecto": proyecto,
            "elimina": elimina,
        }
        text_content = render_to_string(
            'emails/proyectos/correo_notificacion_relacion_proyecto_cotizacion_asesor.html',
            context=context
        )
        asunto = 'Relación de proyecto %s a cotización %s-%s' % (
            proyecto.id_proyecto,
            cotizacion.unidad_negocio,
            cotizacion.nro_cotizacion
        )
        if elimina:
            asunto = 'ELIMINACIÓN relación de proyecto %s a cotización %s-%s' % (
                proyecto.id_proyecto,
                cotizacion.unidad_negocio,
                cotizacion.nro_cotizacion
            )
        msg = EmailMultiAlternatives(
            asunto,
            text_content,
            bcc=['fabio.garcia.sanchez@gmail.com'],
            from_email='Odecopack No Reply <%s>' % correo_from,
            to=[correo_to]
        )
        msg.attach_alternative(text_content, "text/html")
        try:
            msg.send()
        except Exception as e:
            raise ValidationError(
                {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})


def cotizacion_envio_correo_relacionar_literal(
        cotizacion_id: int,
        literal_id: int,
        elimina=False
) -> None:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    literal = Literal.objects.get(pk=literal_id)

    correo_to = cotizacion.responsable.email
    correo_from = 'noreply@odecopack.com'
    if correo_to is not None:
        context = {
            "cotizacion": cotizacion,
            "literal": literal,
            "elimina": elimina,
        }
        text_content = render_to_string(
            'emails/proyectos/correo_notificacion_relacion_literal_cotizacion_asesor.html',
            context=context
        )
        asunto = 'Relación de literal %s a cotización %s-%s' % (
            literal.id_literal,
            cotizacion.unidad_negocio,
            cotizacion.nro_cotizacion
        )
        if elimina:
            asunto = 'ELIMINACIÓN relación de literal %s a cotización %s-%s' % (
                literal.id_literal,
                cotizacion.unidad_negocio,
                cotizacion.nro_cotizacion
            )
        msg = EmailMultiAlternatives(
            asunto,
            text_content,
            bcc=['fabio.garcia.sanchez@gmail.com'],
            from_email='Odecopack No Reply <%s>' % correo_from,
            to=[correo_to]
        )
        msg.attach_alternative(text_content, "text/html")
        try:
            msg.send()
        except Exception as e:
            raise ValidationError(
                {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})


def acuerdo_pago_cambiar_fecha_proyectada(
        cotizacion_id: int,
        acuerdo_pago_id: int,
        nueva_fecha_proyectada: datetime
):
    acuerdo_pago = CotizacionPagoProyectadoAcuerdoPago.objects.get(pk=acuerdo_pago_id)
    if acuerdo_pago.orden_compra.cotizacion_id != int(cotizacion_id):
        raise ValidationError({'_error': 'Este acuerdo de pago no pertenece a esta cotización, por favor revisar'})
    nueva_fecha_proyectada = datetime.datetime.strptime(nueva_fecha_proyectada, "%Y-%m-%d").date()
    if acuerdo_pago.fecha_proyectada != nueva_fecha_proyectada:
        acuerdo_pago.fecha_proyectada = nueva_fecha_proyectada
        acuerdo_pago.save()


def cotizacion_upload_documento(
        cotizacion_id: int,
        nombre_archivo: str,
        user_id: int,
        archivo,
        tipo: str = 'OTROS',
) -> ArchivoCotizacion:
    archivo_cotizacion = ArchivoCotizacion()
    archivo_cotizacion.archivo = archivo
    archivo_cotizacion.cotizacion_id = cotizacion_id
    archivo_cotizacion.nombre_archivo = nombre_archivo
    archivo_cotizacion.creado_por_id = user_id
    archivo_cotizacion.tipo = tipo
    archivo_cotizacion.save()
    return archivo_cotizacion
