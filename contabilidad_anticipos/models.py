import datetime
from decimal import Decimal

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum, F
from model_utils.models import TimeStampedModel
from cargues_catalogos.models import ClienteCatalogo
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFit

from proyectos.models import Literal


class ProformaConfiguracion(models.Model):
    def firma_upload_to(instance, filename):
        fecha = datetime.datetime.now()
        return "proforma/configuracion/firma_%s%s%s%s%s%s.%s" % (
            fecha.year, fecha.month, fecha.day, fecha.hour, fecha.minute, fecha.second, filename.split('.')[-1])

    def encabezado_upload_to(instance, filename):
        fecha = datetime.datetime.now()
        return "proforma/configuracion/encabezado_%s%s%s%s%s%s.%s" % (
            fecha.year, fecha.month, fecha.day, fecha.hour, fecha.minute, fecha.second, filename.split('.')[-1])

    informacion_odecopack = models.TextField(null=True)
    informacion_bancaria = models.TextField(null=True)
    email_copia_default = models.EmailField(null=True)
    firma = ProcessedImageField(
        processors=[ResizeToFit(width=400, height=300, upscale=False)],
        format='PNG',
        options={'quality': 100},
        null=True,
        upload_to=firma_upload_to
    )
    encabezado = ProcessedImageField(
        processors=[ResizeToFit(1190, 228)],
        format='PNG',
        options={'quality': 100},
        null=True,
        upload_to=encabezado_upload_to
    )


class ProformaAnticipo(TimeStampedModel):
    ESTADOS_CHOICES = (
        ('CREADA', 'Creada'),
        ('ENVIADA', 'Enviada'),
        ('RECIBIDA', 'Recibida'),
        ('EDICION', 'Edicion'),
        ('ANULADA', 'Anulada'),
        ('CERRADA', 'Cerrada'),
    )
    DIVISA_CHOICES = (
        ('COP', 'Pesos Colombianos'),
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
    nro_consecutivo = models.IntegerField(null=True)
    version = models.IntegerField(default=1)
    estado = models.CharField(max_length=20, choices=ESTADOS_CHOICES, default='CREADA')
    email_destinatario = models.EmailField(null=True)
    email_destinatario_dos = models.EmailField(null=True)
    informacion_locatario = models.TextField(null=True)
    informacion_cliente = models.TextField(null=True)
    divisa = models.CharField(choices=DIVISA_CHOICES, max_length=10)
    tipo_documento = models.CharField(choices=TIPO_DOCUMENTO_CHOICES, max_length=20)
    nit = models.CharField(max_length=20)
    nombre_cliente = models.CharField(max_length=200)
    fecha = models.DateField()
    nro_orden_compra = models.CharField(max_length=20)
    condicion_pago = models.CharField(max_length=200)
    cobrado = models.BooleanField(default=False)
    impuesto = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    fecha_cambio_estado = models.DateField(null=True)
    fecha_seguimiento = models.DateField(null=True)
    fecha_cobro = models.DateField(null=True)
    literales = models.ManyToManyField(Literal, 'cobros')

    @property
    def editable(self) -> bool:
        return self.estado in ['CREADA', 'EDICION']

    @property
    def documento(self):
        if self.editable:
            return None
        return self.envios.last()

    @property
    def valor_total_sin_impuesto(self) -> Decimal:
        return self.items.aggregate(total=Sum(F('cantidad') * F('valor_unitario')))['total']

    class Meta:
        permissions = [
            ("list_proformaanticipo", "Can list proformas anticipos"),
        ]


class ProformaAnticipoArchivo(TimeStampedModel):
    def archivo_upload_to(instance, filename):
        return "proforma/%s/archivos/%s" % (instance.id, filename)

    enviar_por_correo = models.BooleanField(default=False)
    nombre_archivo = models.CharField(max_length=300)
    archivo = models.FileField(null=True, upload_to=archivo_upload_to)
    cobro = models.ForeignKey(ProformaAnticipo, related_name='documentos', on_delete=models.PROTECT)
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True)

    class Meta:
        permissions = [
            ("list_proformaanticipoarchivo", "Can see list proforma anticipo archivos"),
        ]


class ProformaAnticipoEnvios(TimeStampedModel):
    proforma_anticipo = models.ForeignKey(
        ProformaAnticipo,
        related_name='envios',
        on_delete=models.PROTECT
    )
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='cobros_enviados')
    archivo = models.FileField(null=True)
    version = models.PositiveIntegerField()


class ProformaAnticipoItem(TimeStampedModel):
    proforma_anticipo = models.ForeignKey(
        ProformaAnticipo,
        related_name='items',
        on_delete=models.PROTECT
    )
    referencia = models.CharField(max_length=120)
    descripcion = models.CharField(max_length=300)
    cantidad = models.DecimalField(decimal_places=2, max_digits=12)
    valor_unitario = models.DecimalField(decimal_places=2, max_digits=12)

    @property
    def valor_total(self):
        return self.valor_unitario * self.cantidad
