from decimal import Decimal
from django.db import models

from django.contrib.auth.models import User

from model_utils.models import TimeStampedModel
from cguno.models import ColaboradorBiable, Literal, ColaboradorCostoMesBiable


class HojaTrabajoDiario(TimeStampedModel):
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT)
    fecha = models.DateField()
    tasa = models.ForeignKey(ColaboradorCostoMesBiable, on_delete=models.PROTECT, blank=True, null=True,
                             related_name='mis_dias_trabajados')
    colaborador = models.ForeignKey(ColaboradorBiable, on_delete=models.PROTECT, related_name='mis_dias_trabajados')

    class Meta:
        unique_together = [('fecha', 'colaborador')]
        permissions = [
            ("list_hojatrabajodiario", "Can see list hoja trabajo diario"),
            ("para_otros_hojatrabajodiario", "Can add hoja trabajo diario para otros"),
            ("costos_hojatrabajodiario", "Can see costos hoja trabajo diario"),
            ("detail_hojatrabajodiario", "Can see detail hoja trabajo diario"),
        ]


class HoraHojaTrabajo(TimeStampedModel):
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)
    hoja = models.ForeignKey(HojaTrabajoDiario, on_delete=models.PROTECT, related_name='mis_horas_trabajadas')
    literal = models.ForeignKey(Literal, on_delete=models.PROTECT, related_name='mis_horas_trabajadas')
    cantidad_minutos = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = [('hoja', 'literal')]
        permissions = [
            ("list_horahojatrabajo", "Can see list horas trabajos diario"),
        ]

    @property
    def costo_total(self):
        return Decimal(self.cantidad_minutos / 60) * self.hoja.tasa.valor_hora
