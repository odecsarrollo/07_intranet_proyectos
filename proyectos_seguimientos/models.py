from django.db import models
from django.contrib.auth.models import User

from proyectos.models import Literal


class Fase(models.Model):
    nombre = models.CharField(max_length=120)
    literales = models.ManyToManyField(Literal, through='FaseLiteral')

    class Meta:
        permissions = [
            ("list_fase", "Can see list fases"),
        ]


class FaseLiteral(models.Model):
    fase = models.ForeignKey(Fase, on_delete=models.PROTECT, related_name='mis_literales')
    literal = models.ForeignKey(Literal, on_delete=models.PROTECT, related_name='mis_fases')
    responsable = models.ForeignKey(User, on_delete=models.PROTECT, related_name='fases_a_revisar',
                                    null=True)


class TareaFase(models.Model):
    fase_literal = models.ForeignKey(FaseLiteral, on_delete=models.PROTECT, related_name='tareas')
    fecha_limite = models.DateField()
    descripcion = models.CharField(max_length=500)
    terminado = models.BooleanField(default=False)
    asignado_a = models.ForeignKey(User, on_delete=models.PROTECT, related_name='tareas_seguimiento_asignadas',
                                   null=True)
