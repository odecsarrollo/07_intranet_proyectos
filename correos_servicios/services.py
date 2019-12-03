from rest_framework.exceptions import ValidationError

from .models import CorreoAplicacion


def correo_aplicacion_crear_actualizar(
        email: str,
        tipo: str,
        aplicacion: str = None,
        alias_from: str = None,
        correo_aplicacion_id: int = None,
) -> CorreoAplicacion:
    CorreoAplicacion.objects.filter()
    if correo_aplicacion_id is not None:
        correo = CorreoAplicacion.objects.get(pk=correo_aplicacion_id)
    else:
        correo = CorreoAplicacion()
        correo.aplicacion = aplicacion

    if tipo == 'FROM':
        con_from = CorreoAplicacion.objects.filter(aplicacion=aplicacion, tipo=tipo)
        if correo_aplicacion_id is not None:
            con_from = con_from.exclude(pk=correo_aplicacion_id)
        if con_from.exists():
            raise ValidationError({'_error': 'Ya existe un correo de tipo FROM y solo puede existir uno'})
    correo.email = email
    correo.alias_from = alias_from
    correo.tipo = tipo
    correo.save()
    return correo
