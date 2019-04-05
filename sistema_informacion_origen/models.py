from django.db import models


# Create your models here.
class SistemaInformacionOrigen(models.Model):
    nombre = models.CharField(max_length=200, unique=True)
    codigo_amarre = models.PositiveIntegerField(default=0)
