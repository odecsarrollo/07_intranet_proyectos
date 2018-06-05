from django.db import models
from model_utils.models import TimeStampedModel
from clientes.models import ClienteBiable
from cotizaciones.models import Cotizacion


class Proyecto(models.Model):
    cotizacion = models.OneToOneField(Cotizacion, on_delete=models.PROTECT, related_name='mi_proyecto', null=True,
                                      blank=True)
    id_proyecto = models.CharField(max_length=15, unique=True)
    fecha_prometida = models.DateField(null=True, blank=True)
    abierto = models.BooleanField(default=True)
    costo_materiales = models.DecimalField(decimal_places=2, max_digits=12, default=0)
    en_cguno = models.BooleanField(default=True)
    nombre = models.CharField(max_length=200, null=True, blank=True)
    cliente = models.ForeignKey(ClienteBiable, on_delete=models.PROTECT, null=True, blank=True)

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
            ("costo_mano_obra_proyecto", "Ver costo MO proyecto"),
            ("costo_materiales_proyecto", "Ver costo materiales proyecto"),
            ("costo_presupuestado_proyecto", "Ver costo presupuestado proyecto"),
        ]


class Literal(models.Model):
    id_literal = models.CharField(max_length=15, unique=True)
    cotizacion = models.OneToOneField(Cotizacion, on_delete=models.PROTECT, related_name='mi_literal', null=True,
                                      blank=True)
    proyecto = models.ForeignKey(Proyecto, related_name='mis_literales', on_delete=models.CASCADE)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    costo_materiales = models.DecimalField(decimal_places=2, max_digits=12, default=0, null=True, blank=True)
    en_cguno = models.BooleanField(default=True)
    abierto = models.BooleanField(default=True)

    def __str__(self):
        return self.id_literal
