import datetime

from django.db.models import Max
from rest_framework.exceptions import ValidationError

from .models import Cotizacion


def cotizacion_quitar_relacionar_proyecto(
        cotizacion_id: int,
        proyecto_id: int
) -> Cotizacion:
    cotizacion = Cotizacion.objects.get(pk=cotizacion_id)
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
        cotizacion.proyectos.add(proyecto_id)
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
