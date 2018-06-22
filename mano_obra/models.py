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
