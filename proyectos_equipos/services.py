from datetime import date

from rest_framework.exceptions import ValidationError

from proyectos.models import Literal
from proyectos_equipos.models import EquipoProyecto
from proyectos_equipos.models import TipoEquipo
from proyectos_equipos.models import TipoEquipoCampo
from proyectos_equipos.models import TipoEquipoCampoEquipo
from proyectos_equipos.models import TipoEquipoClase
from proyectos_equipos.models import TipoEquipoDocumento
from postventa.models import PostventaRutinaTipoEquipo


def rutina_crear(
        descripcion: str,
        mes: int,
        tipo_equipo_id: int = None,
        tipo_equipo_clase_id: int = None,
):
    if tipo_equipo_clase_id is None and tipo_equipo_id is None:
        raise ValidationError(
            {'_error': 'Debe pasar el id de un tipo de equipo o de una clase de equipo'})
    rutina = PostventaRutinaTipoEquipo()
    rutina.descripcion = descripcion
    rutina.mes = mes
    if tipo_equipo_clase_id is not None:
        rutina.tipo_equipo_clase_id = tipo_equipo_clase_id
    if tipo_equipo_id is not None:
        rutina.tipo_equipo_id = tipo_equipo_id
    rutina.save()


def rutina_eliminar(
        rutina_id: int,
        tipo_equipo_id: int = None,
        tipo_equipo_clase_id: int = None,
):
    if tipo_equipo_clase_id is None and tipo_equipo_id is None:
        raise ValidationError(
            {'_error': 'Debe pasar el id de un tipo de equipo o de una clase de equipo'})
    rutina = PostventaRutinaTipoEquipo.objects.get(pk=rutina_id)
    if tipo_equipo_clase_id is not None:
        if rutina.tipo_equipo_clase_id != int(tipo_equipo_clase_id):
            raise ValidationError(
                {'_error': 'La rutina que desea eliminar no tiene relación con el actual tipo de equipo clase'})

    if tipo_equipo_id is not None:
        if rutina.tipo_equipo_id != int(tipo_equipo_id):
            raise ValidationError(
                {'_error': 'La rutina que desea eliminar no tiene relación con el actual tipo de equipo'})
    rutina.delete()


def rutina_actualizar(
        rutina_id: int,
        descripcion: str,
        mes: int,
        tipo_equipo_id: int = None,
        tipo_equipo_clase_id: int = None,
):
    if tipo_equipo_clase_id is None and tipo_equipo_id is None:
        raise ValidationError(
            {'_error': 'Debe pasar el id de un tipo de equipo o de una clase de equipo'})
    rutina = PostventaRutinaTipoEquipo.objects.get(pk=rutina_id)
    if tipo_equipo_clase_id is not None:
        if rutina.tipo_equipo_clase_id != int(tipo_equipo_clase_id):
            raise ValidationError(
                {'_error': 'La rutina que desea actualizar no tiene relación con el actual tipo de equipo clase'})

    if tipo_equipo_id is not None:
        if rutina.tipo_equipo_id != int(tipo_equipo_id):
            raise ValidationError(
                {'_error': 'La rutina que desea actualizar no tiene relación con el actual tipo de equipo'})

    rutina.mes = mes
    rutina.descripcion = descripcion
    rutina.save()


def upload_documento(
        nombre_archivo: str,
        creado_por_id: int,
        archivo,
        tipo_equipo_id: int = None,
        tipo_equipo_clase_id: int = None,
):
    if tipo_equipo_clase_id is None and tipo_equipo_id is None:
        raise ValidationError(
            {'_error': 'Debe pasar el id de un tipo de equipo o de una case de equipo'})

    TipoEquipoDocumento.objects.create(
        tipo_equipo_id=tipo_equipo_id,
        tipo_equipo_clase_id=tipo_equipo_clase_id,
        archivo=archivo,
        nombre_archivo=nombre_archivo,
        creado_por_id=creado_por_id
    )


def delete_documento(
        archivo_id: int,
        tipo_equipo_id: int = None,
        tipo_equipo_clase_id: int = None,
):
    if tipo_equipo_clase_id is None and tipo_equipo_id is None:
        raise ValidationError(
            {'_error': 'Debe pasar el id de un tipo de equipo o de una case de equipo'})

    documento = TipoEquipoDocumento.objects.get(pk=archivo_id)

    if tipo_equipo_clase_id is not None:
        if documento.tipo_equipo_clase_id != int(tipo_equipo_clase_id):
            raise ValidationError(
                {'_error': 'El documento que desea eliminar no tiene relación con el actual tipo de equipo clase'})

    if tipo_equipo_id is not None:
        if documento.tipo_equipo_id != int(tipo_equipo_id):
            raise ValidationError(
                {'_error': 'El documento que desea eliminar no tiene relación con el actual tipo de equipo'})

    documento.delete()


def update_documento(
        archivo_id: int,
        nombre_archivo: str,
        tipo_equipo_id: int = None,
        tipo_equipo_clase_id: int = None,
):
    documento = TipoEquipoDocumento.objects.get(pk=archivo_id)

    if tipo_equipo_clase_id is not None:
        if documento.tipo_equipo_clase_id != int(tipo_equipo_clase_id):
            raise ValidationError(
                {'_error': 'El documento que desea editar no tiene relación con el actual tipo de equipo clase'})

    if tipo_equipo_id is not None:
        if documento.tipo_equipo_id != int(tipo_equipo_id):
            raise ValidationError(
                {'_error': 'El documento que desea editar no tiene relación con el actual tipo de equipo'})

    documento.nombre_archivo = nombre_archivo
    documento.save()


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


def campo_eliminar(
        tipo_equipo_campo_id: int,
        tipo_equipo_id: int = None,
        tipo_equipo_clase_id: int = None,
):
    if tipo_equipo_clase_id is None and tipo_equipo_id is None:
        raise ValidationError(
            {'_error': 'Debe pasar el id de un tipo de equipo o de una case de equipo'})

    campo = TipoEquipoCampo.objects.get(pk=tipo_equipo_campo_id)
    if tipo_equipo_clase_id is not None:
        if campo.tipo_equipo_clase_id != int(tipo_equipo_clase_id):
            raise ValidationError(
                {'_error': 'El campo que desea eliminar no tiene relación con el actual tipo de equipo clase'})

    if tipo_equipo_id is not None:
        if campo.tipo_equipo_id != int(tipo_equipo_id):
            raise ValidationError(
                {'_error': 'El campo que desea eliminar no tiene relación con el actual tipo de equipo'})
    campo.delete()


def campo_crear(
        label: str,
        tamano: int,
        tamano_columna: int,
        tipo: str,
        orden: int,
        obligatorio: bool,
        unidad_medida: str = None,
        opciones_list: str = None,
        tipo_equipo_id: int = None,
        tipo_equipo_clase_id: int = None,
):
    if tipo_equipo_clase_id is None and tipo_equipo_id is None:
        raise ValidationError(
            {'_error': 'Debe pasar el id de un tipo de equipo o de una case de equipo'})
    TipoEquipoCampo.objects.create(
        obligatorio=obligatorio,
        tipo_equipo_id=tipo_equipo_id,
        tipo_equipo_clase_id=tipo_equipo_clase_id,
        label=label,
        tamano=tamano,
        tamano_columna=tamano_columna,
        unidad_medida=unidad_medida,
        tipo=tipo,
        orden=orden,
        opciones_list=opciones_list
    )


def campo_actualizar(
        tipo_equipo_campo_id: int,
        label: str,
        tamano: int,
        tamano_columna: int,
        tipo: str,
        orden: int,
        obligatorio: bool,
        unidad_medida: str = None,
        tipo_equipo_id: int = None,
        tipo_equipo_clase_id: int = None,
        opciones_list: str = None
):
    if tipo_equipo_clase_id is None and tipo_equipo_id is None:
        raise ValidationError(
            {'_error': 'Debe pasar el id de un tipo de equipo o de una case de equipo'})

    campo = TipoEquipoCampo.objects.get(pk=tipo_equipo_campo_id)

    if tipo_equipo_clase_id is not None:
        if campo.tipo_equipo_clase_id != int(tipo_equipo_clase_id):
            raise ValidationError(
                {'_error': 'El campo que desea eliminar no tiene relación con el actual tipo de equipo clase'})

    if tipo_equipo_id is not None:
        if campo.tipo_equipo_id != int(tipo_equipo_id):
            raise ValidationError(
                {'_error': 'El campo que desea eliminar no tiene relación con el actual tipo de equipo'})

    campo.label = label
    campo.tamano = tamano
    campo.obligatorio = obligatorio
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
        fecha_fabricacion: date = None,
        campos_adicionales: dict = None
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

    campos_obligatorios_tipo_equipo = tipo_equipo_clase.tipo_equipo.campos
    for campo in campos_obligatorios_tipo_equipo.filter(obligatorio=True).all():
        valor_digitado = campos_adicionales[campo.id] if campo.id in campos_adicionales else None
        if valor_digitado is None or valor_digitado == '':
            raise ValidationError({'campoTP_%s' % campo.id: 'Este campo es requerido'})

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

    for campo_id in campos_adicionales:
        campo_adicional = TipoEquipoCampo.objects.get(pk=campo_id)
        TipoEquipoCampoEquipo.objects.create(
            equipo=nuevo_equipo,
            tamano=campo_adicional.tamano,
            tamano_columna=campo_adicional.tamano_columna,
            tipo=campo_adicional.tipo,
            label=campo_adicional.label,
            valor=campos_adicionales[campo_id],
            unidad_medida=campo_adicional.unidad_medida,
            orden=campo_adicional.orden
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


def equipo_eliminar(
        equipo_id: int
):
    equipo = EquipoProyecto.objects.get(pk=equipo_id)
    TipoEquipoCampoEquipo.objects.filter(equipo_id=equipo_id).delete()
    equipo.delete()
