import datetime

from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.db.models import Max
from django.db.models.functions import Substr
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from proyectos.models import Proyecto, Literal
from .models import Cotizacion, SeguimientoCotizacion
from clientes.models import ClienteBiable
from reversion.models import Version
from cotizaciones.models import CondicionInicioProyecto, CondicionInicioProyectoCotizacion


def cotizacion_versions(cotizacion_id: int) -> Version:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    versions = Version.objects.get_for_object(cotizacion)
    return versions


def cotizacion_envio_correo_notificacion_condiciones_inicio_completas(
        cotizacion_id: int
):
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    correos_to = ['fabio.garcia.sanchez@gmail.com']
    context = {
        "cotizacion": cotizacion,
        "condiciones_inicio_cotizacion": cotizacion.condiciones_inicio_cotizacion.order_by('fecha_entrega').all()
    }
    text_content = render_to_string('emails/cotizacion_proyecto/correo_base.html', context=context)
    msg = EmailMultiAlternatives(
        'Solicitud apertura Cotizacion %s-%s' % (
            cotizacion.unidad_negocio,
            cotizacion.nro_cotizacion
        ),
        text_content,
        # bcc=[configuracion.email_copia_default],
        from_email='Odecopack SAS <%s>' % 'prueba@odecopack.com',
        to=correos_to
    )
    msg.attach_alternative(text_content, "text/html")

    documentos_para_enviar = cotizacion.condiciones_inicio_cotizacion.filter(require_documento=True)
    for condicion in documentos_para_enviar.all():
        if condicion.documento:
            nombre_archivo = '%s.%s' % (condicion.descripcion, condicion.documento.name.split('.')[-1])
            msg.attach(nombre_archivo, condicion.documento.read())
    try:
        msg.send()
    except Exception as e:
        raise ValidationError(
            {'_error': 'Se há presentado un error al intentar enviar el correo, envío fallido: %s' % e})
    return cotizacion


def cotizacion_verificar_condicion_inicio_proyecto_si_estan_completas(
        cotizacion_id: int
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    condiciones_incompletas = cotizacion.condiciones_inicio_cotizacion.filter(fecha_entrega__isnull=True)
    if not condiciones_incompletas.exists():
        fecha_max = cotizacion.condiciones_inicio_cotizacion.aggregate(fecha_max=Max('fecha_entrega'))['fecha_max']
        cotizacion.condiciones_inicio_fecha_ultima = fecha_max
        cotizacion.condiciones_inicio_completas = True
        cotizacion.save()
        cotizacion_envio_correo_notificacion_condiciones_inicio_completas(cotizacion.id)
    else:
        cotizacion.condiciones_inicio_fecha_ultima = None
        cotizacion.condiciones_inicio_completas = False
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


def cotizacion_limpiar_condicion_inicio_proyecto(
        cotizacion_id: int,
        condicion_inicio_proyecto_id: int
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    condiciones_inicio_cotizaciones = cotizacion.condiciones_inicio_cotizacion.filter(
        condicion_inicio_proyecto_id=condicion_inicio_proyecto_id)
    for condicion_inicio in condiciones_inicio_cotizaciones.all():
        condicion_inicio.fecha_entrega = None
        condicion_inicio.documento = None
        condicion_inicio.save()
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    cotizacion.condiciones_inicio_completas = False
    cotizacion.condiciones_inicio_fecha_ultima = None
    cotizacion.save()
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
        condicion_proyecto.cotizacion_proyecto = cotizacion
        condicion_proyecto.save()
        cotizacion.condiciones_inicio_completas = False
        cotizacion.condiciones_inicio_fecha_ultima = None
    cotizacion.save()
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    return cotizacion


def cotizacion_crear(
        created_by_id: User,
        unidad_negocio: str,
        descripcion_cotizacion: str,
        origen_cotizacion: str,
        fecha_entrega_pactada_cotizacion: datetime,
        fecha_limite_segumiento_estado: datetime,
        observacion: str = None,
        cotizacion_inicial_id: int = None,
        contacto_cliente_id: int = None,
        cliente_id: int = None
) -> Cotizacion:
    if unidad_negocio == 'ADI' and cotizacion_inicial_id is None:
        raise ValidationError(
            {'_error': 'Una cotización adicional debe tener una inicial obligatoriamente'})
    if unidad_negocio == 'ADI' and cotizacion_inicial_id is not None:
        cotizacion_inicial = Cotizacion.objects.get(pk=cotizacion_inicial_id)
        if cotizacion_inicial.unidad_negocio == 'ADI':
            raise ValidationError(
                {'_error': 'Una cotización inicial no puede ser otra adicional'})
        elif cotizacion_inicial.estado != 'Cierre (Aprobado)':
            raise ValidationError(
                {'_error': 'La cotización inicial debe de estar en estado Cierre (Aprobado)'})

    if unidad_negocio != 'ADI' and (cliente_id is None or contacto_cliente_id is None):
        raise ValidationError(
            {'_error': 'La cotización debe tener cliente y contacto'})

    if cliente_id is not None:
        cliente = ClienteBiable.objects.get(pk=cliente_id)
        contactos = cliente.contactos.filter(pk=contacto_cliente_id)
        if not contactos.exists():
            raise ValidationError(
                {'_error': 'El contacto seleccionado no existe para el cliente elegido'})

    cotizacion = Cotizacion()
    cotizacion.created_by_id = created_by_id
    cotizacion.unidad_negocio = unidad_negocio
    cotizacion.cotizacion_inicial_id = cotizacion_inicial_id
    cotizacion.descripcion_cotizacion = descripcion_cotizacion
    cotizacion.observacion = observacion
    cotizacion.origen_cotizacion = origen_cotizacion
    cotizacion.fecha_cambio_estado = timezone.now().date()
    cotizacion.cliente_id = cliente_id
    cotizacion.contacto_cliente_id = contacto_cliente_id
    cotizacion.responsable_id = created_by_id
    cotizacion.fecha_entrega_pactada_cotizacion = fecha_entrega_pactada_cotizacion
    cotizacion.fecha_limite_segumiento_estado = fecha_limite_segumiento_estado
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
        cotizacion_id: int,
        estado: str,
        unidad_negocio: str,

        responsable_id: int,
        descripcion_cotizacion: str,
        origen_cotizacion: str,
        fecha_entrega_pactada_cotizacion: datetime,
        fecha_limite_segumiento_estado: datetime,
        orden_compra_fecha: datetime.date = None,

        cotizacion_inicial_id: int = None,
        contacto_cliente_id: int = None,
        cliente_id: int = None,

        valor_ofertado: float = None,
        costo_presupuestado: float = None,
        valor_orden_compra: float = None,
        observacion: str = None,
        orden_compra_nro: str = None,
        estado_observacion_adicional: str = None,
        dias_pactados_entrega_proyecto: int = None,
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    cambio_estado = estado != cotizacion.estado

    # Valida que no se vaya a cambiar de estado de Cierre (Aprobado) si tiene cotizaciones adicionales o proyectos vinculados
    if cotizacion.estado == 'Cierre (Aprobado)' and cambio_estado:
        if cotizacion.cotizaciones_adicionales.count() > 0 or cotizacion.proyectos.count() > 0:
            raise ValidationError(
                {
                    '_error': 'Para cambiar una cotización cuyo estado es %s a %s no deben haber cotizaciones adicionales relacionadas ni proyectos relacionados' % (
                        cotizacion.estado, estado)})

    cotizacion.estado = estado
    # Valida que al cambiar el cliente o contacto, el contacto pertenezca al cliente definido
    if cliente_id is not None:
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
            {'_error': 'No se puede cambiar de la unidad de negocio %s a %s' % (
                cotizacion.unidad_negocio, unidad_negocio)})
    else:
        cotizacion.unidad_negocio = unidad_negocio

    if estado in ['Aplazado', 'Cancelado', 'Aceptación de Terminos y Condiciones']:
        if estado_observacion_adicional is None:
            raise ValidationError({
                '_error': 'Una cotización en estado %s debe tener una observación del estado' % cotizacion.estado})
        cotizacion.estado_observacion_adicional = estado_observacion_adicional
    else:
        cotizacion.estado_observacion_adicional = None

    if estado in ['Cotización Enviada', 'Evaluación Técnica y Económica', 'Aceptación de Terminos y Condiciones',
                  'Cierre (Aprobado)']:
        if valor_ofertado is None or valor_ofertado <= 0:
            raise ValidationError(
                {'_error': 'Para el estado de %s es necesario tener un valor ofertado' % estado})
        cotizacion.valor_ofertado = valor_ofertado
    else:
        cotizacion.valor_ofertado = 0

    # Valida cuándo se puede crear un número de cotización
    if estado not in ['Aplazado', 'Cancelado', 'Cita/Generación Interés']:
        if cotizacion.nro_cotizacion is None:
            cotizacion.nro_cotizacion = cotizacion_generar_numero_cotizacion()

    if cambio_estado:
        cotizacion.fecha_cambio_estado = timezone.now().date()

    if estado == 'Cierre (Aprobado)':
        if cambio_estado:
            cotizacion.fecha_cambio_estado_cerrado = timezone.now()
    else:
        cotizacion.fecha_cambio_estado_cerrado = None

    if estado == 'Cierre (Aprobado)':
        if costo_presupuestado is None or costo_presupuestado <= 0:
            raise ValidationError({
                '_error': 'Para el estado de Cierre (Aprobado) es necesario tener un costo presupuestado del proyecto'})
        else:
            cotizacion.costo_presupuestado = costo_presupuestado

        if orden_compra_fecha is None:
            raise ValidationError({
                '_error': 'Para el estado de Cierre (Aprobado) es necesario tener una fecha de la orden de compra'})
        else:
            cotizacion.orden_compra_fecha = orden_compra_fecha

        if valor_orden_compra is None or valor_orden_compra <= 0:
            raise ValidationError({
                '_error': 'Para el estado de Cierre (Aprobado) es necesario tener un valor de la orden de compra'})
        else:
            cotizacion.valor_orden_compra = valor_orden_compra

        if dias_pactados_entrega_proyecto is None or dias_pactados_entrega_proyecto <= 0:
            raise ValidationError({
                '_error': 'Para el estado de Cierre (Aprobado) es necesario tener unos días pactados de entrega del proyectos'})
        else:
            cotizacion.dias_pactados_entrega_proyecto = dias_pactados_entrega_proyecto

        if orden_compra_nro is None:
            raise ValidationError({
                '_error': 'Para el estado de Cierre (Aprobado) es necesario tener un número de orden de compra'})
    else:
        cotizacion.costo_presupuestado = 0
        cotizacion.orden_compra_fecha = None
        cotizacion.valor_orden_compra = 0
        cotizacion.orden_compra_nro = None
        cotizacion.dias_pactados_entrega_proyecto = None

    cotizacion.responsable_id = responsable_id
    cotizacion.descripcion_cotizacion = descripcion_cotizacion
    cotizacion.observacion = observacion
    cotizacion.origen_cotizacion = origen_cotizacion
    cotizacion.fecha_entrega_pactada_cotizacion = fecha_entrega_pactada_cotizacion
    cotizacion.fecha_limite_segumiento_estado = fecha_limite_segumiento_estado
    cotizacion.cotizacion_inicial_id = cotizacion_inicial_id
    cotizacion.orden_compra_nro = orden_compra_nro

    cotizacion.save()
    if cambio_estado:
        SeguimientoCotizacion.objects.create(
            cotizacion=cotizacion,
            tipo_seguimiento=1,
            creado_por_id=modified_by_id,
            estado=cotizacion.estado
        )

    return cotizacion


def cotizacion_quitar_relacionar_literal(
        cotizacion_id: int,
        literal_id: int
) -> Cotizacion:
    cotizacion_adicional = Cotizacion.objects.get(pk=cotizacion_id)
    tiene_literal = cotizacion_adicional.literales.filter(pk=literal_id).exists()
    if tiene_literal:
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

    nuevo_nro_cotizacion = (int('%s%s' % (ano, mes)) * 10000) + ultimo_indice

    return nuevo_nro_cotizacion
