from django.db import models


class ClienteBiable(models.Model):
    nit = models.CharField(max_length=20, null=True, blank=True)
    nombre = models.CharField(max_length=200)

    class Meta:
        permissions = [
            ['list_clientebiable', 'Puede listar clientes'],
            ['detail_clientebiable', 'Puede ver detalle cliente'],
        ]
