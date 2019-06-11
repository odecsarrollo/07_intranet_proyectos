from django.db import models
from imagekit.models import ProcessedImageField, ImageSpecField
from imagekit.processors import ResizeToFit, ResizeToFill
# Create your models here.

class EquipoComputador(models.Model):

    MARCA_CHOICES = (
        (1, 'SONY'),
        (2, 'TOSHIBA'),
        (3, 'LENOVO'),
        (4, 'ASUS'),
        (5, 'DELL'),
        (6, 'MAC')
    )

    PROCESADOR_CHOICES = (
        (1, 'CORE I3'),
        (2, 'CORE I5'),
        (3, 'CORE I7'),
        (4, 'AMD')
    )

    TIPO_PC_CHOICES = (
        (1, 'ESCRITORIO'),
        (2, 'PORTATIL')
    )

    ESTADO_CHOICES = (
        (1, 'EN PRODUCCIÓN'),
        (2, 'FUERA DE PRODUCCIÓN')
    )

    nombre = models.CharField(max_length=100, unique=True)
    marca = models.IntegerField(choices=MARCA_CHOICES)
    referencia = models.CharField(max_length=50, null=True)
    procesador = models.IntegerField(choices=PROCESADOR_CHOICES)
    tipo = models.IntegerField(choices=TIPO_PC_CHOICES)
    serial = models.CharField(max_length=50, null=True)
    estado = models.IntegerField(choices=ESTADO_CHOICES, default=1)
    descripcion = models.CharField(max_length=100, null=True)

    class Meta:
        permissions = [
            ("list_sequipocomputador", "Can list computadores"),
        ]

    @property
    def marca_nombre(self) -> str:
        return self.get_marca_display()

    @property
    def procesador_nombre(self) -> str:
        return self.get_procesador_display()

    @property
    def tipo_nombre(self) -> str:
        return self.get_tipo_display()

    @property
    def estado_nombre(self) -> str:
        return self.get_estado_display()

class EquipoComputadorFoto(models.Model):

    def archivo_upload_to(instance, filename):
        return "imagenes/medios/computadores/%s" % (filename)

    descripcion = models.CharField(max_length=100, null=True)
    computador = models.ForeignKey(EquipoComputador, on_delete=models.PROTECT)
    foto = ProcessedImageField(
        processors=[ResizeToFit(width=400, height=480, upscale=False)],
        format='PNG',
        options={'quality': 100},
        null=True,
        upload_to=archivo_upload_to
    )

    foto_small = ImageSpecField(
        source='foto',
        processors=[
            ResizeToFill(150, 80),
        ],
        format='JPEG'
    )

class EquipoCelular(models.Model):

    MARCA_CHOICES = (
        (1, 'SAMSUNG'),
        (2, 'HUAWEY'),
        (3, 'HONOR')
    )

    marca =  models.IntegerField(choices=MARCA_CHOICES)
    referencia = models.CharField(max_length=50)
    imei_1 = models.CharField(max_length=30)
    imei_2 = models.CharField(max_length=30, null=True)
    numero_1 = models.CharField(max_length=20)
    numero_2 = models.CharField(max_length=20, null=True)
    descripcion = models.CharField(max_length=100, null=True)

    @property
    def marca_nombre(self) -> str:
        return self.get_marca_display()

class EquipoCelularFoto(models.Model):

    def archivo_upload_to(instance, filename):
        return "imagenes/medios/celulares/%s" % (filename)

    descripcion = models.CharField(max_length=100, null=True)
    celular = models.ForeignKey(EquipoCelular, on_delete=models.PROTECT)
    foto = ProcessedImageField(
        processors=[ResizeToFit(width=400, height=480, upscale=False)],
        format='PNG',
        options={'quality': 100},
        null=True,
        upload_to=archivo_upload_to
    )

    foto_small = ImageSpecField(
        source='foto',
        processors=[
            ResizeToFill(150, 80),
        ],
        format='JPEG'
    )