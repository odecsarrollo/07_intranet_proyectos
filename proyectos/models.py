from decimal import Decimal
from django.db import models
from django.db.models import Sum, Value as V
from django.db.models.functions import Coalesce
from model_utils.models import TimeStampedModel


class Proyecto(models.Model):
    id_proyecto = models.CharField(max_length=15, unique=True)
    fecha_prometida = models.DateField(null=True, blank=True)
    abierto = models.BooleanField(default=True)
    valor_cliente = models.DecimalField(decimal_places=2, max_digits=12, default=0)
    costo_presupuestado = models.DecimalField(decimal_places=2, max_digits=12, default=0)
    costo_materiales = models.DecimalField(decimal_places=2, max_digits=12, default=0)
    costo_mano_obra = models.DecimalField(decimal_places=2, max_digits=12, default=0)

    def actualizar_costos_mano_obra(self):
        costo_horas = Decimal(self.mis_literales.aggregate(
            costo_horas=Coalesce(Sum('mis_horas_trabajadas__costo_total'), V(0)),
        )['costo_horas'])
        self.costo_mano_obra = costo_horas
        self.save()

    def __str__(self):
        return self.id_proyecto

    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'
        permissions = [
            ("list_proyecto", "Can see list proyectos"),
            ("detail_proyecto", "Can see detail proyecto"),
            ("valor_proyecto", "Ver valor proyecto"),
            ("costo_proyecto", "Ver costo proyecto"),
            ("costo_materiales_proyecto", "Ver costo materiales proyecto"),
            ("costo_presupuestado_proyecto", "Ver costo presupuestado proyecto"),
        ]


class Literal(models.Model):
    id_literal = models.CharField(max_length=15, unique=True)
    proyecto = models.ForeignKey(Proyecto, related_name='mis_literales', on_delete=models.CASCADE)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    costo_materiales = models.DecimalField(decimal_places=2, max_digits=12, default=0)
    costo_mano_obra = models.DecimalField(decimal_places=2, max_digits=12, default=0)

    def actualizar_costos_mano_obra(self):
        costo_horas = Decimal(self.mis_horas_trabajadas.aggregate(
            costo_horas=Coalesce(Sum('costo_total'), V(0)),
        )['costo_horas'])
        self.costo_mano_obra = costo_horas
        self.save()

    def __str__(self):
        return self.id_literal

    class Meta:
        verbose_name = 'Literal'
        verbose_name_plural = 'Literales'
