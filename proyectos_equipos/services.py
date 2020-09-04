from datetime import date

from rest_framework.exceptions import ValidationError

from proyectos.models import Literal
from proyectos_equipos.models import EquipoProyecto
from proyectos_equipos.models import TipoEquipo
from proyectos_equipos.models import TipoEquipoCampo
from proyectos_equipos.models import TipoEquipoClase
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


def tipo_equipo_clase_eliminar(
        tipo_equipo_id: int,
        tipo_equipo_clase_id: int
):
    clase = TipoEquipoClase.objects.get(pk=tipo_equipo_clase_id)
    if clase.tipo_equipo_id != int(tipo_equipo_id):
        raise ValidationError({'_error': 'La clase que desea eliminar no tiene relación con el actual tipo de equipo'})
    if clase.equipos.exists():
        raise ValidationError({'_error': 'Imposible eliminar, esta clase contiene %s equipos' % clase.equipos.count()})
    clase.delete()


def tipo_equipo_campo_eliminar(
        tipo_equipo_id: int,
        tipo_equipo_campo_id: int
):
    campo = TipoEquipoCampo.objects.get(pk=tipo_equipo_campo_id)
    if campo.tipo_equipo_id != int(tipo_equipo_id):
        raise ValidationError({'_error': 'El campo que desea eliminar no tiene relación con el actual tipo de equipo'})
    campo.delete()


def tipo_equipo_campo_crear(
        tipo_equipo_id: int,
        label: str,
        tamano: int,
        tamano_columna: int,
        tipo: str,
        orden: int,
        unidad_medida: str = None,
        opciones_list: str = None
):
    TipoEquipoCampo.objects.create(
        tipo_equipo_id=tipo_equipo_id,
        label=label,
        tamano=tamano,
        tamano_columna=tamano_columna,
        unidad_medida=unidad_medida,
        tipo=tipo,
        orden=orden,
        opciones_list=opciones_list
    )


def tipo_equipo_campo_actualizar(
        tipo_equipo_id: int,
        tipo_equipo_campo_id: int,
        label: str,
        tamano: int,
        tamano_columna: int,
        tipo: str,
        orden: int,
        unidad_medida: str = None,
        opciones_list: str = None
):
    campo = TipoEquipoCampo.objects.get(pk=tipo_equipo_campo_id)
    if campo.tipo_equipo_id != int(tipo_equipo_id):
        raise ValidationError({'_error': 'El campo que desea modificar no tiene relación con el actual tipo de equipo'})
    campo.label = label
    campo.tamano = tamano
    campo.tamano_columna = tamano_columna
    campo.unidad_medida = unidad_medida
    campo.tipo = tipo
    campo.opciones_list = opciones_list
    campo.orden = orden
    campo.save()


def tipo_equipo_clase_crear(
        tipo_equipo_id: int,
        nombre: str,
        sigla: str
):
    if TipoEquipoClase.objects.filter(
            sigla=sigla,
            tipo_equipo_id=tipo_equipo_id
    ).exists():
        raise ValidationError({'_error': 'Ya existe una clase con esta sigla, por favor intente con otra'})

    TipoEquipoClase.objects.create(
        tipo_equipo_id=tipo_equipo_id,
        nombre=nombre,
        sigla=sigla
    )


def tipo_equipo_clase_update(
        tipo_equipo_id: int,
        tipo_equipo_clase_id: int,
        nombre: str,
        sigla: str,
        activo: bool
):
    if TipoEquipoClase.objects.exclude(pk=tipo_equipo_clase_id).filter(
            sigla=sigla,
            tipo_equipo_id=tipo_equipo_id
    ).exists():
        raise ValidationError({'_error': 'Ya existe una clase con esta sigla, por favor intente con otra'})
    clase = TipoEquipoClase.objects.get(pk=tipo_equipo_clase_id)
    if clase.tipo_equipo_id != int(tipo_equipo_id):
        raise ValidationError({'_error': 'La clase que desea modificar no tiene relación con el actual tipo de equipo'})
    clase.nombre = nombre
    clase.sigla = sigla
    clase.activo = activo
    clase.save()


def equipo_proyecto_create(
        literal_id: int,
        nombre: str,
        tipo_equipo_clase_id: int,
        creado_por_id: int,
        fecha_entrega: date = None,
        fecha_fabricacion: date = None
) -> EquipoProyecto:
    tipo_equipo_clase = TipoEquipoClase.objects.using('read_only').get(pk=tipo_equipo_clase_id)

    if not tipo_equipo_clase.activo:
        raise ValidationError({
            '_error': 'El tipo de equipo %s no se encuentra activo, no se puede crear un equipo de este tipo' % tipo_equipo_clase.nombre})

    literal = Literal.objects.get(pk=literal_id)
    cantidad_equipos_actuales = literal.equipos.count()
    nro_consecutivo = cantidad_equipos_actuales + 1
    nro_consecutivo = str(nro_consecutivo) if nro_consecutivo > 9 else '0' + str(nro_consecutivo)
    identificador = '%s%s%s%s' % (
        tipo_equipo_clase.tipo_equipo.sigla,
        tipo_equipo_clase.sigla,
        literal.id_literal,
        nro_consecutivo
    )

    nuevo_equipo = EquipoProyecto.objects.create(
        tipo_equipo_clase_id=tipo_equipo_clase_id,
        nombre=nombre,
        creado_por_id=creado_por_id,
        fecha_entrega=fecha_entrega,
        fecha_fabricacion=fecha_fabricacion,
        nro_consecutivo=cantidad_equipos_actuales,
        literal_id=literal_id,
        identificador=identificador
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
