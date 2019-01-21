from django.db import models
from django.contrib.auth.models import User

from proyectos.models import Literal
from model_utils.models import TimeStampedModel


class Fase(models.Model):
    orden = models.IntegerField(default=0)
    nombre = models.CharField(max_length=120)
    color = models.CharField(max_length=10, default='black')
    letra_color = models.CharField(max_length=10, default='white')
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


class TareaFase(TimeStampedModel):
    ESTADO_CHOICES = (
        (1, 'NUEVA'),
        (2, 'PENDIENTE'),
        (3, 'EN PROCESO'),
        (4, 'TERMINADO'),
    )
    fase_literal = models.ForeignKey(FaseLiteral, on_delete=models.PROTECT, related_name='tareas')
    fecha_inicial = models.DateField()
    fecha_limite = models.DateField()
    descripcion = models.CharField(max_length=500)
    campo_uno = models.CharField(max_length=200, default='')
    campo_dos = models.CharField(max_length=200, default='')
    campo_tres = models.CharField(max_length=200, default='')
    asignado_a = models.ForeignKey(User, on_delete=models.PROTECT, related_name='tareas_seguimiento_asignadas',
                                   null=True)
    estado = models.PositiveIntegerField(choices=ESTADO_CHOICES, default=1)
