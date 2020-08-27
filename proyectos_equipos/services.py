from datetime import date

from rest_framework.exceptions import ValidationError

from proyectos_equipos.models import EquipoProyecto
from proyectos_equipos.models import TipoEquipo
from proyectos_equipos.models import TipoEquipoDocumento


def tipo_equipo_upload_documento(
        tipo_equipo_id: int,
        nombre_archivo: str,
        creado_por_id: int,
        archivo
):
    TipoEquipoDocumento.objects.create(
        tipo_equipo_id=tipo_equipo_id,
        archivo=archivo,
        nombre_archivo=nombre_archivo,
        creado_por_id=creado_por_id
    )


def tipo_equipo_delete_documento(
        tipo_equipo_id: int,
        archivo_id: int
):
    TipoEquipoDocumento.objects.filter(pk=archivo_id, tipo_equipo_id=tipo_equipo_id).delete()


def tipo_equipo_update_documento(
        tipo_equipo_id: int,
        archivo_id: int,
        nombre_archivo: str
):
    TipoEquipoDocumento.objects.filter(
        pk=archivo_id,
        tipo_equipo_id=tipo_equipo_id
    ).update(
        nombre_archivo=nombre_archivo
    )


def equipo_proyecto_create(
        literal_id: int,
        nombre: str,
        tipo_equipo_id: int,
        creado_por_id: int,
        nro_identificacion: int,
        fecha_entrega: date = None
) -> EquipoProyecto:
    tipo_equipo = TipoEquipo.objects.using('read_only').get(pk=tipo_equipo_id)
    if not tipo_equipo.activo:
        raise ValidationError({
            '_error': 'El tipo de equipo %s no se encuentra activo, no se puede crear un equipo de este tipo' % tipo_equipo.nombre})
    existe_nro_identificacion = EquipoProyecto.objects.using('read_only').filter(
        nro_identificacion=nro_identificacion).exists()
    if existe_nro_identificacion:
        raise ValidationError({
            '_error': 'El número de equipo %s ya ha sido asignado, debe asignar otro' % nro_identificacion})

    nuevo_equipo = EquipoProyecto.objects.create(
        tipo_equipo_id=tipo_equipo_id,
        nombre=nombre,
        creado_por_id=creado_por_id,
        nro_identificacion=nro_identificacion,
        fecha_entrega=fecha_entrega,
        literal_id=literal_id
    )
    return nuevo_equipo


def equipo_proyecto_update(
        equipo_proyecto_id: int,
        literal_id: int,
        nombre: str,
        tipo_equipo_id: int,
        nro_identificacion: int,
        fecha_entrega: date = None
):
    tipo_equipo = TipoEquipo.objects.using('read_only').get(pk=tipo_equipo_id)
    if not tipo_equipo.activo:
        raise ValidationError({
            '_error': 'El tipo de equipo %s no se encuentra activo, no se puede crear un equipo de este tipo' % tipo_equipo.nombre})
    existe_nro_identificacion = EquipoProyecto.objects.using('read_only').exclude(pk=equipo_proyecto_id).filter(
        nro_identificacion=nro_identificacion).exists()

    if existe_nro_identificacion:
        raise ValidationError({
            '_error': 'El número de equipo %s ya ha sido asignado, debe asignar otro' % nro_identificacion})
    EquipoProyecto.objects.update(
        nro_identificacion=nro_identificacion,
        fecha_entrega=fecha_entrega,
        nombre=nombre,
        literal_id=literal_id
    )
