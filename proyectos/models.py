from django.db import models
from model_utils.models import TimeStampedModel


class Proyecto(models.Model):
    id_proyecto = models.CharField(max_length=15, unique=True)
    fecha_prometida = models.DateField(null=True, blank=True)
    abierto = models.BooleanField(default=True)
    costo_materiales = models.DecimalField(decimal_places=2, max_digits=12, default=0)

    def __str__(self):
        return self.id_proyecto

    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'


class Literal(models.Model):
    id_literal = models.CharField(max_length=15, unique=True)
    proyecto = models.ForeignKey(Proyecto, related_name='mis_literales', on_delete=models.CASCADE)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    costo_materiales = models.DecimalField(decimal_places=2, max_digits=12, default=0)
    horas_colaboradores = models.ManyToManyField(
        'cguno.ColaboradorBiable',
        through='HoraColaboradorLiteralProyecto'
    )

    def __str__(self):
        return self.id_literal

    class Meta:
        verbose_name = 'Literal'
        verbose_name_plural = 'Literales'


class HoraColaboradorLiteralProyecto(TimeStampedModel):
    colaborador = models.ForeignKey('cguno.ColaboradorBiable', on_delete=models.PROTECT)
    literal_proyecto = models.ForeignKey(Literal, on_delete=models.PROTECT)
    minutos = models.PositiveIntegerField(default=0)
    date = models.DateField()
