from django.db import models
from model_utils.models import TimeStampedModel
from cargues_catalogos.models import ClienteCatalogo


class ProformaConfiguracion(models.Model):
    def firma_upload_to(instance, filename):
        return "proforma/configuracion/%s" % (filename)

    def encabezado_upload_to(instance, filename):
        return "proforma/configuracion/%s" % (filename)

    informacion_odecopack = models.TextField()
    informacion_bancaria = models.TextField()
    firma = models.FileField(upload_to=firma_upload_to, null=True)
    encabezado = models.FileField(upload_to=encabezado_upload_to, null=True)


class ProformaAnticipo(TimeStampedModel):
    DIVISA_CHOICES = (
        ('USD', 'Dólares'),
        ('EUR', 'Euros'),
    )
    TIPO_DOCUMENTO_CHOICES = (
        ('PROFORMA', 'Proforma'),
        ('CUENTA_COBRO', 'Cuenta de Cobro'),
    )
    cliente = models.ForeignKey(
        ClienteCatalogo,
        on_delete=models.PROTECT,
        null=True,
        related_name='cobros_anticipos'
    )
    nro_consecutivo = models.IntegerField()
    informacion_locatario = models.TextField(null=True)
    informacion_cliente = models.TextField(null=True)
    divisa = models.CharField(choices=DIVISA_CHOICES)
    nit = models.CharField(max_length=20)
    nombre_cliente = models.CharField(max_length=200)
    fecha = models.DateField()
    nro_orden_cobro = models.CharField()
    condicion_pago = models.CharField(max_length=200)


class ProformaAnticipoItem(TimeStampedModel):
    proforma_anticipo = models.ForeignKey(
        ProformaAnticipo,
        related_name='items',
        on_delete=models.PROTECT
    )
    descripcion = models.CharField(max_length=300)
    cantidad = models.DecimalField(decimal_places=2, max_digits=12)
    valor_unitario = models.DecimalField(decimal_places=2, max_digits=12)
