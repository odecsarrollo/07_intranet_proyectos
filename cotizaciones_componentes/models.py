from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel

from clientes.models import ContactoCliente, ClienteBiable
from cotizaciones_componentes.managers import CotizacionComponenteManager
from geografia.models import Ciudad
from listas_precios.models import FormaPagoCanal
from bandas_eurobelt.models import BandaEurobelt, ComponenteBandaEurobelt
from catalogo_productos.models import ItemVentaCatalogo
from imagekit.models import ProcessedImageField, ImageSpecField
from imagekit.processors import ResizeToFit, ResizeToFill


class CotizacionComponente(TimeStampedModel):
    ESTADOS = (
        ('INI', 'Edición'),
        ('ENV', 'Enviada'),
        ('REC', 'Recibida'),
        ('PRO', 'En Proceso'),
        ('FIN', 'Entragada Totalmente'),
        ('ELI', 'Rechazada'),
    )
    responsable = models.ForeignKey(
        User,
        related_name='cotizaciones_componentes',
        on_delete=models.PROTECT,
        null=True
    )
    creado_por = models.ForeignKey(
        User,
        related_name='cotizaciones_componentes_creadas',
        on_delete=models.PROTECT,
        null=True
    )
    nro_consecutivo = models.PositiveIntegerField(null=True)
    cliente = models.ForeignKey(ClienteBiable, related_name='cotizaciones_componentes', on_delete=models.PROTECT)
    contacto = models.ForeignKey(ContactoCliente, related_name='cotizaciones_componentes', on_delete=models.PROTECT)
    ciudad = models.ForeignKey(Ciudad, related_name='cotizaciones_componentes', on_delete=models.PROTECT)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='INI')
    observaciones = models.TextField(null=True)
    objects = CotizacionComponenteManager()

    @property
    def pdf(self):
        return self.versiones.last()

    class Meta:
        permissions = [
            ("list_cotizacioncomponente", "Can list cotizaciones componentes")
        ]


class CotizacionComponenteDocumento(TimeStampedModel):
    def archivo_upload_to(instance, filename):
        return "cotizaciones/ventas_componentes/%s/%s" % (instance.cotizacion_componente.id, filename)

    cotizacion_componente = models.ForeignKey(CotizacionComponente, on_delete=models.PROTECT, related_name='versiones')
    creado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='cotizaciones_componentes_documentos_creados'
    )
    version = models.PositiveIntegerField()
    pdf_cotizacion = models.FileField(upload_to=archivo_upload_to)


class CotizacionComponenteAdjunto(TimeStampedModel):
    def archivo_upload_to(instance, filename):
        extencion = filename.split('.')[-1]
        return "cotizaciones/ventas_componentes/%s/%s.%s" % (
            instance.cotizacion_componente.id, instance.nombre_adjunto, extencion)

    nombre_adjunto = models.CharField(max_length=300)
    cotizacion_componente = models.ForeignKey(
        CotizacionComponente,
        on_delete=models.PROTECT,
        related_name='adjuntos'
    )
    adjunto = models.FileField(upload_to=archivo_upload_to, null=True)
    imagen = ProcessedImageField(
        processors=[ResizeToFit(1080, 720)],
        format='JPEG',
        options={'quality': 70},
        null=True,
        upload_to=archivo_upload_to
    )
    imagen_thumbnail = ImageSpecField(
        source='imagen',
        processors=[ResizeToFill(100, 100)],
        format='JPEG',
        options={'quality': 60}
    )
    creado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='cotizaciones_componentes_imagenes_adjuntadas'
    )


class ItemCotizacionComponente(TimeStampedModel):
    posicion = models.PositiveIntegerField()
    cotizacion = models.ForeignKey(CotizacionComponente, related_name="items", on_delete=models.PROTECT)
    componente_eurobelt = models.ForeignKey(
        ComponenteBandaEurobelt,
        related_name="items_cotizaciones_componentes",
        null=True,
        on_delete=models.PROTECT
    )
    banda_eurobelt = models.ForeignKey(
        BandaEurobelt,
        related_name="items_cotizaciones_componentes",
        null=True,
        on_delete=models.PROTECT
    )
    articulo_catalogo = models.ForeignKey(
        ItemVentaCatalogo,
        related_name="items_cotizaciones_componentes",
        null=True,
        on_delete=models.PROTECT
    )
    forma_pago = models.ForeignKey(
        FormaPagoCanal,
        related_name="items_cotizaciones_componentes",
        null=True,
        on_delete=models.PROTECT
    )

    dias_entrega = models.PositiveIntegerField(default=0)
    descripcion = models.CharField(max_length=120, null=True)
    referencia = models.CharField(max_length=120, null=True)
    unidad_medida = models.CharField(max_length=120, null=True)
    cantidad = models.DecimalField(max_digits=18, decimal_places=3)
    precio_unitario = models.DecimalField(max_digits=18, decimal_places=2)
    valor_total = models.DecimalField(max_digits=18, decimal_places=2)

    @property
    def tiempo_entrega(self):
        dias = self.dias_entrega
        if dias == 0:
            return 'Inmediato'
        elif dias == 1:
            return '1 día'
        return '%s días' % dias
