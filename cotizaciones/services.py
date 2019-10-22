import datetime

from django.contrib.auth.models import User
from django.db.models import Max
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import Cotizacion, SeguimientoCotizacion
from clientes.models import ClienteBiable


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
        fecha_entrega_pactada: datetime.date = None,

        cotizacion_inicial_id: int = None,
        contacto_cliente_id: int = None,
        cliente_id: int = None,

        valor_ofertado: float = None,
        costo_presupuestado: float = None,
        valor_orden_compra: float = None,
        observacion: str = None,
        orden_compra_nro: str = None,
        estado_observacion_adicional: str = None,
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
        if fecha_entrega_pactada is None:
            raise ValidationError({
                '_error': 'Para el estado de Cierre (Aprobado) es necesario tener una fecha de entrega del proyecto'})
        else:
            cotizacion.fecha_entrega_pactada = fecha_entrega_pactada

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

        if orden_compra_nro is None:
            raise ValidationError({
                '_error': 'Para el estado de Cierre (Aprobado) es necesario tener un número de orden de compra'})
    else:
        cotizacion.fecha_entrega_pactada = None
        cotizacion.costo_presupuestado = 0
        cotizacion.orden_compra_fecha = None
        cotizacion.valor_orden_compra = 0
        cotizacion.orden_compra_nro = None

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


def cotizacion_quitar_relacionar_proyecto(
        cotizacion_id: int,
        proyecto_id: int
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    if cotizacion.unidad_negocio == 'ADI':
        raise ValidationError(
            {'_error': 'Las cotizaciones de tipo adicional no pueden tener poryectos relacionados'})
    if cotizacion.cotizacion_inicial is not None:
        raise ValidationError(
            {
                '_error': 'La cotización ya esta relacionada con otra anterior, quien ya tiene una relación con un proyecto. No es necesario relacionar de nuevo'})
    if cotizacion.estado != 'Cierre (Aprobado)':
        raise ValidationError(
            {'_error': 'La cotización debe de estar en estado cerrado para poder relacionarle un proyecto.'})

    if cotizacion.proyectos.filter(pk=proyecto_id).exists():
        cotizacion.proyectos.remove(proyecto_id)
    else:
        if cotizacion.estado == 'Cierre (Aprobado)':
            cotizacion.proyectos.add(proyecto_id)
        else:
            raise ValidationError(
                {'_error': 'Solo se pueden relacionar proyectos a cotizaciones que se encuentren en estado de Cierre'})

    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
    if cotizacion.proyectos.count() > 0:
        cotizacion.relacionada = True
    else:
        cotizacion.relacionada = False
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
    base_nro_cotizacion = int('%s%s' % ((abs(int(now.year)) % 100), (abs(int(now.month))))) * 10000
    qs = Cotizacion.objects.filter(
        nro_cotizacion__isnull=False,
        nro_cotizacion__gte=base_nro_cotizacion
    ).aggregate(
        ultimo_indice=Max('nro_cotizacion')
    )
    ultimo_indice = qs['ultimo_indice']
    if ultimo_indice is None:
        return base_nro_cotizacion
    else:
        return int(ultimo_indice) + 1
