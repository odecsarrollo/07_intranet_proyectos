from .models import EquipoComputador


def computadores_crear(
        nombre: str,
        marca: int,
        estado: int,
        procesador: int,
        referencia: str,
        serial: str,
        tipo: int,
        descripcion: str = None
):
    EquipoComputador.objects.create(
        nombre=nombre,
        marca=marca,
        estado=estado,
        procesador=procesador,
        referencia=referencia,
        serial=serial,
        tipo=tipo,
        descripcion=descripcion
    )

    return True
