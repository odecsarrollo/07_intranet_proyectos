from django.core.mail import EmailMultiAlternatives
from django.db.models import Count
from django.db.models.functions import Substr, Length
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from correos_servicios.models import CorreoAplicacion
from .models import Literal, Proyecto
from cotizaciones.models import Cotizacion


def proyecto_envio_correo_apertura_proyectos_para_almacen(
        proyecto_id: int
) -> Proyecto:
    correos = CorreoAplicacion.objects.filter(aplicacion='CORREO_COTIZACION_APERTURA_OP')
    correo_from = correos.filter(tipo='FROM').first()
    correos_to = list(correos.values_list('email', flat=True).filter(tipo='TO'))
    literales_id_notificacion_disenadores = []
    correos_cc = list(correos.values_list('email', flat=True).filter(tipo='CC'))
    correos_bcc = list(correos.values_list('email', flat=True).filter(tipo='BCC'))

    proyecto = Proyecto.objects.get(pk=proyecto_id)
    literales_para_correos_para_apertura = proyecto.mis_literales.filter(correo_apertura=False).all()
    if not literales_para_correos_para_apertura.exists():
        raise ValidationError({'_error': 'Ya todos los literales y el proyecto se han notificado para apertura'})

    context = {
        "proyecto": proyecto,
        "literales": literales_para_correos_para_apertura
    }
    for literal in literales_para_correos_para_apertura:
        literales_id_notificacion_disenadores.append(literal.id)
        literal.correo_apertura = True
        literal.save()
    if len(literales_id_notificacion_disenadores) > 0:
        literal_envio_correo_asignacion_disenador(literales_id=literales_id_notificacion_disenadores)

    text_content = render_to_string('emails/proyectos/correo_aperturas_para_almacen.html', context=context)
    msg = EmailMultiAlternatives(
        'Solicitud creacion apertura %s' % (
            proyecto.id_proyecto
        ),
        text_content,
        cc=correos_cc,
        bcc=correos_bcc,
        from_email='%s <%s>' % (
            correo_from.alias_from, correo_from.email) if correo_from else 'noreply@odecopack.com',
        to=correos_to if len(correos_to) > 0 else ['fabio.garcia.sanchez@gmail.com']
    )
    msg.attach_alternative(text_content, "text/html")
    try:
        msg.send()
    except Exception as e:
        raise ValidationError(
            {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    proyecto = Proyecto.objects.get(pk=proyecto_id)
    return proyecto


def proyecto_generar_id_proyecto(
        tipo_op: str,
) -> str:
    now = timezone.datetime.now()
    nro_base_proyecto = (abs(int(now.year)) % 100) * 1000
    proyectos = Proyecto.objects.annotate(
        nro_op=Substr('id_proyecto', 3, 5),
        tamano=Length('id_proyecto')
    ).filter(
        tamano=7,
        id_proyecto__startswith=tipo_op.upper(),
        nro_op__gte=nro_base_proyecto,
        id__gte=500
    )
    if not proyectos.exists():
        return '%s%s' % (tipo_op.upper(), nro_base_proyecto)
    else:
        ultimo = proyectos.last()
        nro = int(ultimo.nro_op) + 1
        return '%s%s' % (tipo_op.upper(), nro)


def proyecto_crear_actualizar(
        nombre: str = None,
        cotizacion_relacionada_id: int = None,
        proyecto_id: int = None,
        abierto: bool = True,
        id_proyecto: str = None,
        tipo_id_proyecto: str = None,
        cotizacion_componentes_nro_cotizacion: str = None,
        cotizacion_componentes_nro_orden_compra: str = None,
        cotizacion_componentes_precio_venta: float = 0,
) -> Proyecto:
    if proyecto_id is not None:
        proyecto = Proyecto.objects.get(pk=proyecto_id)
        if cotizacion_componentes_precio_venta < 0:
            raise ValidationError({
                '_error': 'No se puede asociar un precio de venta de cotización de componentes porque tiene cotizaciones de proyectos asociadas'})
        cambio_id_proyecto = not id_proyecto == proyecto.id_proyecto
        if id_proyecto is not None:
            if cambio_id_proyecto and proyecto.en_cguno:
                raise ValidationError(
                    {
                        '_error': 'El id del proyecto no se puede cambiar, ya esta sincronizado con el sistema de información'})
            proyecto.id_proyecto = id_proyecto
    else:
        if tipo_id_proyecto is None and id_proyecto is None:
            raise ValidationError(
                {
                    '_error': 'Para crear un proyecto debe de definir que tipo de proyecto es. Ej. OP, OO, OS o el numero de proyecto'})

        if tipo_id_proyecto is not None and id_proyecto is not None:
            raise ValidationError(
                {
                    '_error': 'Se ha definido tipo de proyecto y numero de proyecto, sólo se puede definir uno'})

        proyecto = Proyecto()
        proyecto.en_cguno = False
        proyecto.costo_materiales = 0
        if tipo_id_proyecto is not None:
            proyecto.id_proyecto = proyecto_generar_id_proyecto(tipo_id_proyecto)
        elif id_proyecto is not None:
            if Proyecto.objects.filter(id_proyecto=id_proyecto).exists():
                raise ValidationError(
                    {'_error': 'El numero de proyecto ya existe, debe elegir otro'})
            proyecto.id_proyecto = id_proyecto
    proyecto.abierto = abierto
    proyecto.cotizacion_componentes_nro_cotizacion = cotizacion_componentes_nro_cotizacion
    proyecto.cotizacion_componentes_nro_orden_compra = cotizacion_componentes_nro_orden_compra
    proyecto.cotizacion_componentes_precio_venta = cotizacion_componentes_precio_venta
    proyecto.nombre = nombre
    proyecto.save()

    if proyecto_id is None:
        if cotizacion_relacionada_id is not None:
            from cotizaciones.services import cotizacion_quitar_relacionar_proyecto
            cotizacion = Cotizacion.objects.get(pk=cotizacion_relacionada_id)
            proyecto.cliente_id = cotizacion.cliente_id
            cotizacion_quitar_relacionar_proyecto(
                cotizacion_id=cotizacion_relacionada_id,
                proyecto_id=proyecto.id
            )
            proyecto.save()
            proyecto_envio_correo_creacion_proyecto_para_cotizacion(
                cotizacion_id=cotizacion_relacionada_id,
                proyecto_id=proyecto.id
            )
    return proyecto


def proyecto_correr_actualizacion_clientes():
    proyectos = Proyecto.objects.annotate(cantidad_cotizaciones=Count('cotizaciones')).filter(
        cantidad_cotizaciones__gt=0, cliente__isnull=True).all()
    for proyecto in proyectos:
        if proyecto.cotizaciones.exists():
            cotizacion = proyecto.cotizaciones.first()
            proyecto.cliente_id = cotizacion.cliente_id
            proyecto.save()


def literal_crear_actualizar(
        id_literal: str,
        descripcion: str,
        abierto: bool = True,
        literal_id: int = None,
        proyecto_id: int = None,
        disenador_id: int = None,
) -> Literal:
    if literal_id is not None:
        literal = Literal.objects.get(pk=literal_id)
        proyecto = literal.proyecto
        cambio_disenador = disenador_id != literal.disenador_id
        literal.disenador_id = disenador_id
        literal.save()
        if cambio_disenador and literal.disenador:
            literal_envio_correo_asignacion_disenador(literales_id=[literal.id])
    else:
        proyecto = Proyecto.objects.get(pk=proyecto_id)
        existe = proyecto.mis_literales.filter(id_literal=id_literal).exists()
        if existe:
            raise ValidationError({'_error': 'Ya existe un literal con ese código para este proyecto'})
        literal = Literal()
        literal.disenador_id = disenador_id
        literal.en_cguno = False
    cambio_id_literal = literal_id is not None and not literal.id_literal == id_literal
    if cambio_id_literal and literal.en_cguno:
        raise ValidationError(
            {'_error': 'El id del literal no se puede cambiar, ya esta sincronizado con el sistema de información'})
    if cambio_id_literal and not ('%s-' % proyecto.id_proyecto in id_literal or proyecto.id_proyecto == id_literal):
        raise ValidationError({'_error': 'El id literal no corresponde al proyecto'})
    literal.id_literal = id_literal
    literal.proyecto = proyecto
    literal.descripcion = descripcion
    literal.abierto = abierto
    literal.save()
    return literal


def literal_envio_correo_asignacion_disenador(
        literales_id: []
) -> None:
    correo_from = 'noreply@odecopack.com'
    literales = Literal.objects.filter(pk__in=literales_id)
    disenadores_id_correo_to = []
    for literal in literales.all():
        if literal.disenador and literal.disenador.email:
            if literal.disenador.id not in disenadores_id_correo_to:
                disenadores_id_correo_to.append(literal.disenador.id)

    for disenador_id in disenadores_id_correo_to:
        literales_disenador = literales.filter(disenador_id=disenador_id)
        disenador = literales_disenador.first().disenador
        proyecto = literales.first().proyecto
        correo_to = disenador.email
        context = {
            "literales": literales_disenador.all()
        }
        text_content = render_to_string('emails/proyectos/correo_notificacion_disenador.html', context=context)
        msg = EmailMultiAlternatives(
            'Asignación de literales para proyecto %s' % (
                proyecto.id_proyecto
            ),
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


def proyecto_envio_correo_creacion_proyecto_para_cotizacion(
        cotizacion_id: int,
        proyecto_id: int
) -> None:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    proyecto = Proyecto.objects.get(pk=proyecto_id)

    correo_to = cotizacion.responsable.email
    correo_from = 'noreply@odecopack.com'
    if correo_to is not None:
        context = {
            "cotizacion": cotizacion,
            "proyecto": proyecto
        }
        text_content = render_to_string(
            'emails/proyectos/correo_notificacion_apertura_proyecto_asesor.html',
            context=context
        )
        msg = EmailMultiAlternatives(
            'Apertura de proyecto para cotización %s-%s' % (
                cotizacion.unidad_negocio,
                cotizacion.nro_cotizacion
            ),
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
