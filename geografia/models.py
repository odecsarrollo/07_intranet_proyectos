from django.db import models


# Create your models here.

class Pais(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    nueva_desde_cotizacion = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ("list_pais", "Can list paises"),
        ]


class Departamento(models.Model):
    nombre = models.CharField(max_length=120)
    pais = models.ForeignKey(Pais, related_name='mis_departamentos', on_delete=models.PROTECT)
    nueva_desde_cotizacion = models.BooleanField(default=False)

    class Meta:
        unique_together = ('nombre', 'pais')
        permissions = [
            ("list_departamento", "Can list departamentos"),
        ]


class Ciudad(models.Model):
    nombre = models.CharField(max_length=120)
    departamento = models.ForeignKey(Departamento, related_name="mis_municipios", on_delete=models.PROTECT)
    nueva_desde_cotizacion = models.BooleanField(default=False)

    class Meta:
        unique_together = ('nombre', 'departamento')
        permissions = [
            ("list_ciudad", "Can list ciudad"),
        ]
