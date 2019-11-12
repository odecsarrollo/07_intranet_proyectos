from django.db.models import Count
from rest_framework.exceptions import ValidationError

from .models import Literal, Proyecto
from cotizaciones.models import Cotizacion


def proyecto_crear(
        id_proyecto: str,
        nombre: str = None,
        cotizacion_relacionada_id: int = None
) -> Proyecto:
    proyecto = Proyecto()
    proyecto.id_proyecto = id_proyecto
    proyecto.abierto = True
    proyecto.en_cguno = False
    proyecto.costo_materiales = 0
    proyecto.nombre = nombre
    proyecto.save()
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


def proyecto_actualizar(
        proyecto_id: int,
        id_proyecto: str,
        abierto: bool,
        nombre: str = None
) -> Proyecto:
    proyecto = Proyecto.objects.get(pk=proyecto_id)
    cambio_id_proyecto = not id_proyecto == proyecto.id_proyecto
    if cambio_id_proyecto and proyecto.en_cguno:
        raise ValidationError(
            {'_error': 'El id del proyecto no se puede cambiar, ya esta sincronizado con el sistema de información'})
    proyecto.id_proyecto = id_proyecto
    proyecto.nombre = nombre
    proyecto.abierto = abierto
    proyecto.save()
    return proyecto


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
