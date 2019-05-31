from django.db import models
from model_utils.models import TimeStampedModel


# Create your models here.


class Adhesivo(models.Model):
    ADHESIVO_CHOICES = (
        (1, 'Etiqueta'),
        (2, 'Sticker')
    )

    def archivo_upload_to(instance, filename):
        return "imagenes/medios/etiquetas/%s" % (filename)

    codigo = models.CharField(max_length=100, unique=True)
    alto = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    ancho = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    color = models.CharField(null=True, max_length=10)
    stock_min = models.IntegerField(null=True, default=0)
    descripcion = models.CharField(null=True, max_length=500)
    imagen = models.FileField(null=True, upload_to=archivo_upload_to)
    tipo = models.IntegerField(choices=ADHESIVO_CHOICES)


class AdhesivoMovimiento(TimeStampedModel):
    MOVIMIENTO_CHOICES = (
        ('E', 'Entrada'),
        ('S', 'Salida')
    )
    tipo = models.CharField(choices=MOVIMIENTO_CHOICES, max_length=1)
    responsable = models.CharField(max_length=50)
    cantidad = models.IntegerField()
    descripcion = models.CharField(max_length=200, null=True)
    saldo = models.IntegerField()
    ultimo = models.BooleanField()
    adhesivo = models.ForeignKey(Adhesivo, on_delete=models.PROTECT, null=True)

    @property
    def tipo_nombre(self) -> str:
        return self.get_tipo_display()
