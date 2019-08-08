from django.db import models

from clientes.models import CanalDistribucion


class FormaPagoCanal(models.Model):
    canal = models.ForeignKey(CanalDistribucion, on_delete=models.PROTECT)
    forma = models.CharField(max_length=100)
    porcentaje = models.DecimalField(max_digits=18, decimal_places=3, default=0)

    class Meta:
        unique_together = ("canal", "forma")
        permissions = [
            ['list_formapagocanal', 'Puede listar formas de pago'],
        ]

