from django.db import models


class CorreoAplicacion(models.Model):
    TIPO_CHOICE = (
        ('FROM', 'from'),
        ('BCC', 'bcc'),
        ('TO', 'to'),
        ('CC', 'cc'),
    )
    aplicacion = models.CharField(max_length=300)
    tipo = models.CharField(max_length=5, choices=TIPO_CHOICE)
    alias_from = models.CharField(max_length=300, null=True)
    email = models.EmailField()

    class Meta:
        permissions = [
            ['list_correoaplicacion', 'Puede listar correos aplicaciones'],
        ]
