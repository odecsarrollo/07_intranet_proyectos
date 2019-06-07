from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel
from imagekit.models import ProcessedImageField, ImageSpecField
from imagekit.processors import ResizeToFit, ResizeToFill


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
    tipo = models.IntegerField(choices=ADHESIVO_CHOICES)
    imagen = ProcessedImageField(
        processors=[ResizeToFit(width=200, height=280, upscale=False)],
        format='PNG',
        options={'quality': 100},
        null=True,
        upload_to=archivo_upload_to
    )

    imagen_small = ImageSpecField(
        source='imagen',
        processors=[
            ResizeToFill(150, 80),
        ],
        format='JPEG'
    )

    class Meta:
        permissions = [
            ("list_adhesivo", "Can list adhesivo "),
        ]

    @property
    def tipo_nombre(self) -> str:
        return self.get_tipo_display()


class AdhesivoMovimiento(TimeStampedModel):
    MOVIMIENTO_CHOICES = (
        ('E', 'Entrada'),
        ('S', 'Salida')
    )
    creado_por = models.ForeignKey(User, related_name='movimientos_adhesivos', on_delete=models.PROTECT)
    tipo = models.CharField(choices=MOVIMIENTO_CHOICES, max_length=1)
    responsable = models.CharField(max_length=100, null=True)
    cantidad = models.IntegerField()
    descripcion = models.CharField(max_length=200, null=True)
    saldo = models.IntegerField()
    ultimo = models.BooleanField()
    adhesivo = models.ForeignKey(Adhesivo, on_delete=models.PROTECT, null=True)

    class Meta:
        permissions = [
            ("list_adhesivomovimiento", "Can list adhesivo movimiento "),
            ("list_inventario_adhesivomovimiento", "Can list adhesivo movimiento inventario"),
        ]

    @property
    def tipo_nombre(self) -> str:
        return self.get_tipo_display()
