from django.db import models


class Cargue(models):
    fecha = models.DateTimeField()


class CargueMovimiento(models):
    cargue = models.ForeignKey(Cargue)
    tipo = models.CharField(max_length=300)
    cantidad_registros = models.PositiveIntegerField()
