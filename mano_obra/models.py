from django.db import models

from model_utils.models import TimeStampedModel
from cguno.models import ColaboradorBiable, Literal


class TasaHora(TimeStampedModel):
    mes = models.PositiveIntegerField()
    ano = models.PositiveIntegerField()
    colaborador = models.ForeignKey(ColaboradorBiable, on_delete=models.PROTECT, related_name='mis_tasas')
    costo_hora = models.DecimalField(decimal_places=2, max_digits=12, default=0)

    class Meta:
        unique_together = [('mes', 'ano','colaborador')]
        permissions = [
            ("list_tasas_horas_hombres", "Can see list tasas horas hombres"),
        ]


class DiaTrabajo(TimeStampedModel):
    fecha = models.DateField()
    tasa = models.ForeignKey(TasaHora, on_delete=models.PROTECT, blank=True, null=True)
    colaborador = models.ForeignKey(ColaboradorBiable, on_delete=models.PROTECT, related_name='mis_dias_trabajados')

    class Meta:
        unique_together = [('fecha', 'colaborador')]


class DiaTrabajoOp(TimeStampedModel):
    dia = models.ForeignKey(DiaTrabajo, on_delete=models.PROTECT, related_name='mis_horas_trabajadas')
    literal = models.ForeignKey(Literal, on_delete=models.PROTECT, related_name='mis_horas_trabajadas')
    cantidad_minutos = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = [('dia', 'literal')]
