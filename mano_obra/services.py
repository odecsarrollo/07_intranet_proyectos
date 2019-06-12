from datetime import date

from cguno.models import ColaboradorCostoMesBiable
from .models import HojaTrabajoDiario


def hoja_trabajo_diario_crear(
        creado_por_user_id: int,
        fecha: date,
        colaborador_id: int
) -> HojaTrabajoDiario:
    hoja_trabajo = HojaTrabajoDiario.objects.create(
        creado_por_id=creado_por_user_id,
        fecha=fecha,
        colaborador_id=colaborador_id
    )
    object, created = ColaboradorCostoMesBiable.objects.get_or_create(
        lapso=hoja_trabajo.fecha.replace(day=1),
        colaborador_id=colaborador_id
    )

    hoja_trabajo.tasa = object
    if created:
        colaborador = hoja_trabajo.colaborador
        campos_tasas = colaborador._meta.get_fields()
        for i in campos_tasas:
            if hasattr(object, i.name) and i.name not in ['mis_dias_trabajados', 'id', 'colaborador']:
                valor = getattr(colaborador, i.name)
                setattr(object, i.name, valor)
        object.save()
        object.calcular_costo_total()

    hoja_trabajo.save()
    return hoja_trabajo
