from rest_framework.exceptions import ValidationError

from .models import AdhesivoMovimiento


def moviento_adhesivo_crear(
        adhesivo_id: int,
        cantidad: int,
        tipo: str,
        descripcion: str,
        responsable: str,
) -> AdhesivoMovimiento:
    if cantidad <= 0:
        raise ValidationError({'_error': 'La cantidad debe ser mayor a 0 y es: %s' % cantidad})

    qs = AdhesivoMovimiento.objects.filter(adhesivo_id=adhesivo_id, ultimo=True)

    movimiento_anterior = qs.first()
    saldo = cantidad
    if movimiento_anterior:
        if tipo == 'E':
            saldo = movimiento_anterior.saldo + cantidad
        elif tipo == 'S':
            saldo = movimiento_anterior.saldo - cantidad
        else:
            raise ValidationError({'_error': 'El tipo definido no existe'})

        if saldo < 0:
            raise ValidationError({'_error': 'La cantidad solicitada es mayor a la existente'})

        movimiento_anterior.ultimo = False
        movimiento_anterior.save()

    movimiento_nuevo = AdhesivoMovimiento.objects.create(
        adhesivo_id=adhesivo_id,
        cantidad=cantidad,
        tipo=tipo,
        descripcion=descripcion,
        responsable=responsable,
        ultimo=True,
        saldo=saldo
    )

    return movimiento_nuevo
