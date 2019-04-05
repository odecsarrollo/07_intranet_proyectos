from django.db import models


# Create your models here.

class Pais(models.Model):
    nombre = models.CharField(max_length=120, unique=True)


class Departamento(models.Model):
    nombre = models.CharField(max_length=120)
    pais = models.ForeignKey(Pais, related_name='mis_departamentos', on_delete=models.PROTECT)

    class Meta:
        unique_together = ('nombre', 'pais')


class Ciudad(models.Model):
    nombre = models.CharField(max_length=120)
    departamento = models.ForeignKey(Departamento, related_name="mis_municipios", on_delete=models.PROTECT)

    class Meta:
        unique_together = ('nombre', 'departamento')
