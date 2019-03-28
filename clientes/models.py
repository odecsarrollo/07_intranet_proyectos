from django.db import models
from django.contrib.auth.models import User

from model_utils.models import TimeStampedModel


class ClienteBiable(models.Model):
    nit = models.CharField(max_length=20, null=True)
    nombre = models.CharField(max_length=200)

    class Meta:
        permissions = [
            ['list_clientebiable', 'Puede listar clientes'],
            ['detail_clientebiable', 'Puede ver detalle cliente'],
        ]


class ContactoCliente(TimeStampedModel):
    cliente = models.ForeignKey(ClienteBiable, on_delete=models.CASCADE, related_name='contactos')
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='contactos_creados')
    nombres = models.CharField(max_length=200)
    pais = models.CharField(max_length=200, null=True)
    ciudad = models.CharField(max_length=200, null=True)
    apellidos = models.CharField(max_length=200)
    correo_electronico = models.EmailField(null=True)
    correo_electronico_2 = models.EmailField(null=True)
    telefono = models.CharField(max_length=120, null=True)
    telefono_2 = models.CharField(max_length=120, null=True)
    cargo = models.CharField(max_length=200, null=True)

    @property
    def full_nombre(self):
        return '%s %s' % (self.nombres, self.apellidos)

    class Meta:
        permissions = [
            ['list_contactocliente', 'Puede listar contactos clientes'],
        ]
