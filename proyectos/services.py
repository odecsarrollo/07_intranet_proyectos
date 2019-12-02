from django.core.mail import EmailMultiAlternatives
from django.db.models import Count
from django.db.models.functions import Substr, Length
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Literal, Proyecto
from cotizaciones.models import Cotizacion


def proyecto_envio_correo_apertura_proyectos_para_almacen(
        proyecto_id: int
) -> Proyecto:
    proyecto = Proyecto.objects.get(pk=proyecto_id)
    correos_to = [
        'guillermo.osorio@odecopack.com',
        'miller.guarnizo@odecopack.com',
    ]
    correos_cc = [
        'alejandro.guevara@odecopack.com',
        'solanyi.mosquera@odecopack.com',
        'edward.villegas@odecopack.com',
    ]
    correos_bcc = [
        'fabio.garcia.sanchez@gmail.com',
    ]
    literales_para_correos_para_apertura = proyecto.mis_literales.filter(correo_apertura=False).all()
    if not literales_para_correos_para_apertura.exists():
        raise ValidationError({'_error': 'Ya todos los literales y el proyecto se han notificado para apertura'})

    context = {
        "proyecto": proyecto,
        "literales": literales_para_correos_para_apertura
    }
    for literal in literales_para_correos_para_apertura:
        literal.correo_apertura = True
        literal.save()

    text_content = render_to_string('emails/proyectos/correo_aperturas_para_almacen.html', context=context)
    msg = EmailMultiAlternatives(
        'Solicitud creacion apertura %s' % (
            proyecto.id_proyecto
        ),
        text_content,
        cc=correos_cc,
        bcc=correos_bcc,
        to=correos_to,
        from_email='ODECOPACK / INGENIERIA - MIGUEL CORDOBA <%s>' % 'miguel.cordoba@odecopack.com',
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
) -> Proyecto:
    if proyecto_id is not None:
        proyecto = Proyecto.objects.get(pk=proyecto_id)
        cambio_id_proyecto = not id_proyecto == proyecto.id_proyecto
        if id_proyecto is not None:
            if cambio_id_proyecto and proyecto.en_cguno:
                raise ValidationError(
                    {
                        '_error': 'El id del proyecto no se puede cambiar, ya esta sincronizado con el sistema de información'})
            proyecto.id_proyecto = id_proyecto
    else:
        if tipo_id_proyecto is None:
            raise ValidationError(
                {
                    '_error': 'Para crear un proyecto debe de definir que tipo de proyecto es. Ej. OP, OO, OS'})

        proyecto = Proyecto()
        proyecto.en_cguno = False
        proyecto.costo_materiales = 0
        proyecto.id_proyecto = proyecto_generar_id_proyecto(tipo_id_proyecto)
    proyecto.abierto = abierto
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
    else:
        proyecto = Proyecto.objects.get(pk=proyecto_id)
        existe = proyecto.mis_literales.filter(id_literal=id_literal).exists()
        if existe:
            raise ValidationError({'_error': 'Ya existe un literal con ese código para este proyecto'})
        literal = Literal()
        literal.en_cguno = False
    cambio_id_literal = literal_id is not None and not literal.id_literal == id_literal
    if cambio_id_literal and literal.en_cguno:
        raise ValidationError(
            {'_error': 'El id del literal no se puede cambiar, ya esta sincronizado con el sistema de información'})
    if cambio_id_literal and not ('%s-' % proyecto.id_proyecto in id_literal or proyecto.id_proyecto == id_literal):
        raise ValidationError({'_error': 'El id literal no corresponde al proyecto'})
    literal.disenador_id = disenador_id
    literal.id_literal = id_literal
    literal.proyecto = proyecto
    literal.descripcion = descripcion
    literal.abierto = abierto
    literal.save()
    return literal
