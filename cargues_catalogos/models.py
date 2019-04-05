from django.db import models
from geografia.models import Ciudad
from sistema_informacion_origen.models import SistemaInformacionOrigen


class PaisCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    pais_id = models.PositiveIntegerField()
    nombre = models.CharField(max_length=120)

    class Meta:
        unique_together = [('sistema_informacion', 'pais_id')]


class DepartamentoCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    departamento_id = models.PositiveIntegerField()
    nombre = models.CharField(max_length=120)
    pais = models.ForeignKey(PaisCatalogo, on_delete=models.PROTECT)

    class Meta:
        unique_together = [('sistema_informacion', 'departamento_id')]


class CiudadCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    ciudad_id = models.PositiveIntegerField()
    nombre = models.CharField(max_length=120)
    departamento = models.ForeignKey(DepartamentoCatalogo, on_delete=models.PROTECT)
    ciudad_intranet = models.ForeignKey(Ciudad, null=True, on_delete=models.PROTECT)

    class Meta:
        unique_together = [('sistema_informacion', 'ciudad_id')]
