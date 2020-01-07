from decimal import Decimal
from django.db import models

from django.contrib.auth.models import User

from model_utils.models import TimeStampedModel
from cguno.models import ColaboradorBiable, Literal, ColaboradorCostoMesBiable, ColaboradorCentroCosto


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
            ("list_hojatrabajodiario_solo_autogestionados", "Can see list hoja trabajo diario autogestionados"),
            ("para_otros_hojatrabajodiario", "Can add hoja trabajo diario para otros"),
            ("costos_hojatrabajodiario", "Can see costos hoja trabajo diario"),
            ("detail_hojatrabajodiario", "Can see detail hoja trabajo diario"),
        ]


class HoraHojaTrabajo(TimeStampedModel):
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)
    hoja = models.ForeignKey(HojaTrabajoDiario, on_delete=models.PROTECT, related_name='mis_horas_trabajadas')
    literal = models.ForeignKey(Literal, on_delete=models.PROTECT, related_name='mis_horas_trabajadas')
    cantidad_minutos = models.PositiveIntegerField(default=0)
    verificado = models.BooleanField(default=False)
    autogestionada = models.BooleanField(default=False)
    descripcion_tarea = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = [('hoja', 'literal')]
        permissions = [
            ("list_horahojatrabajo", "Can see list horas trabajos diario"),
            ("verificar_horahojatrabajo", "Can verificar horas trabajos diario"),
        ]

    @property
    def costo_total(self):
        return Decimal(self.cantidad_minutos / 60) * self.hoja.tasa.valor_hora


class DistribucionHoraHojaTrabajo(TimeStampedModel):
    hoja = models.ForeignKey(
        HojaTrabajoDiario,
        on_delete=models.PROTECT,
        related_name='mis_horas_trabajadas_distribuidas'
    )
    literal = models.ForeignKey(Literal, on_delete=models.PROTECT, related_name='mis_horas_trabajadas_distribuidas')
    verificado = models.BooleanField(default=False)
    am2430_am0100 = models.BooleanField(default=False)
    am0100_am0130 = models.BooleanField(default=False)
    am0130_am0200 = models.BooleanField(default=False)
    am0200_am0230 = models.BooleanField(default=False)
    am0230_am0300 = models.BooleanField(default=False)
    am0300_am0330 = models.BooleanField(default=False)
    am0330_am0400 = models.BooleanField(default=False)
    am0400_am0430 = models.BooleanField(default=False)
    am0430_am0500 = models.BooleanField(default=False)
    am0500_am0530 = models.BooleanField(default=False)
    am0530_am0600 = models.BooleanField(default=False)
    am0600_am0630 = models.BooleanField(default=False)
    am0630_am0700 = models.BooleanField(default=False)
    am0700_am0730 = models.BooleanField(default=False)
    am0730_am0800 = models.BooleanField(default=False)
    am0800_am0830 = models.BooleanField(default=False)
    am0830_am0900 = models.BooleanField(default=False)
    am0900_am0930 = models.BooleanField(default=False)
    am0930_am1000 = models.BooleanField(default=False)
    am1000_am1030 = models.BooleanField(default=False)
    am1030_am1100 = models.BooleanField(default=False)
    am1100_am1130 = models.BooleanField(default=False)
    am1130_pm1200 = models.BooleanField(default=False)
    pm1200_pm1230 = models.BooleanField(default=False)
    pm1230_pm1300 = models.BooleanField(default=False)
    pm1300_pm1330 = models.BooleanField(default=False)
    pm1330_pm1400 = models.BooleanField(default=False)
    pm1400_pm1430 = models.BooleanField(default=False)
    pm1430_pm1500 = models.BooleanField(default=False)
    pm1500_pm1530 = models.BooleanField(default=False)
    pm1530_pm1600 = models.BooleanField(default=False)
    pm1600_pm1630 = models.BooleanField(default=False)
    pm1630_pm1700 = models.BooleanField(default=False)
    pm1700_pm1730 = models.BooleanField(default=False)
    pm1730_pm1800 = models.BooleanField(default=False)
    pm1800_pm1830 = models.BooleanField(default=False)
    pm1830_pm1900 = models.BooleanField(default=False)
    pm1900_pm1930 = models.BooleanField(default=False)
    pm1930_pm2000 = models.BooleanField(default=False)
    pm2000_pm2030 = models.BooleanField(default=False)
    pm2030_pm2100 = models.BooleanField(default=False)
    pm2100_pm2130 = models.BooleanField(default=False)
    pm2130_pm2200 = models.BooleanField(default=False)
    pm2200_pm2230 = models.BooleanField(default=False)
    pm2230_pm2300 = models.BooleanField(default=False)
    pm2300_pm2330 = models.BooleanField(default=False)
    pm2330_am2400 = models.BooleanField(default=False)
    am2400_am2430 = models.BooleanField(default=False)


class HoraTrabajoColaboradorLiteralInicial(TimeStampedModel):
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)
    colaborador = models.ForeignKey(ColaboradorBiable, on_delete=models.PROTECT,
                                    related_name='mis_dias_trabajados_iniciales')
    literal = models.ForeignKey(Literal, on_delete=models.PROTECT, related_name='mis_horas_trabajadas_iniciales')
    cantidad_minutos = models.PositiveIntegerField(default=0)
    valor = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    centro_costo = models.ForeignKey(
        ColaboradorCentroCosto,
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )

    class Meta:
        unique_together = [('colaborador', 'literal')]
        permissions = [
            ['list_horatrabajocolaboradorliteralinicial', 'Puede listar horas colaboradores proyectos iniciales'],
            ['detail_horatrabajocolaboradorliteralinicial', 'Puede ver detalle hora colaborador proyecto inicial'],
        ]


class CierreCostosManoObra(TimeStampedModel):
    efectuado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='cierres_de_costos_creados')
    modificado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='cierres_de_costos_modificados',
                                       null=True)
    ano = models.PositiveIntegerField()
    mes = models.PositiveIntegerField()
