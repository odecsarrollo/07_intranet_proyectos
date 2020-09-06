import datetime

from rest_framework.exceptions import ValidationError

from .models import PostventaGarantia, PostventaEventoEquipoDocumento


def garantia_crear(
        equipo_id: int,
        descripcion: str,
        fecha_inicial: datetime,
        fecha_final: datetime,
        user_id: int
):
    PostventaGarantia.objects.create(
        equipo_id=equipo_id,
        descripcion=descripcion,
        fecha_inicial=fecha_inicial,
        fecha_final=fecha_final,
        creado_por_id=user_id
    )


def garantia_actualizar(
        garantia_id: int,
        equipo_id: int,
        descripcion: str,
        fecha_inicial: datetime,
        fecha_final: datetime
):
    garantia = PostventaGarantia.objects.get(pk=garantia_id)
    if garantia.equipo_id != int(equipo_id):
        raise ValueError({'_error': 'La garantia que desea modificar no corresponde al equipo seleccionado'})
    garantia.descripcion = descripcion
    garantia.fecha_final = fecha_final
    garantia.fecha_inicial = fecha_inicial
    garantia.save()


def garantia_eliminar(
        garantia_id: int,
        equipo_id: int,
):
    garantia = PostventaGarantia.objects.get(pk=garantia_id)
    if garantia.equipo_id != int(equipo_id):
        raise ValueError({'_error': 'La garantia que desea eliminar no corresponde al equipo seleccionado'})
    garantia.delete()


def upload_postventa_evento_equipo_proyecto_documento(
        nombre_archivo: str,
        creado_por_id: int,
        archivo,
        equipo_id: int
):
    PostventaEventoEquipoDocumento.objects.create(
        equipo_id=equipo_id,
        archivo=archivo,
        nombre_archivo=nombre_archivo,
        creado_por_id=creado_por_id
    )


def upload_postventa_evento_equipo_proyecto_imagen(
        nombre_archivo: str,
        creado_por_id: int,
        imagen,
        equipo_id: int
):
    PostventaEventoEquipoDocumento.objects.create(
        equipo_id=equipo_id,
        imagen=imagen,
        nombre_archivo=nombre_archivo,
        creado_por_id=creado_por_id
    )


def delete_postventa_evento_equipo_proyecto_documento(
        documento_id: int,
        equipo_id: int = None,
):
    documento = PostventaEventoEquipoDocumento.objects.get(pk=documento_id, equipo_id=equipo_id)
    documento.delete()


def update_postventa_evento_equipo_proyecto_documento(
        archivo_id: int,
        nombre_archivo: str,
        equipo_id: int = None,
):
    documento = PostventaEventoEquipoDocumento.objects.get(pk=archivo_id, equipo_id=equipo_id)
    documento.nombre_archivo = nombre_archivo
    documento.save()
