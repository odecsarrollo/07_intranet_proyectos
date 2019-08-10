from django.db import models
from model_utils.models import TimeStampedModel

from clientes.models import ContactoCliente, ClienteBiable
from geografia.models import Ciudad
from listas_precios.models import FormaPagoCanal
from bandas_eurobelt.models import BandaEurobelt, ComponenteBandaEurobelt
from catalogo_productos.models import ItemVentaCatalogo


class CotizacionComponente(TimeStampedModel):
    ESTADOS = (
        ('INI', 'Iniciado'),
        ('ENV', 'Enviada'),
        ('REC', 'Recibida'),
        ('PRO', 'En Proceso'),
        ('FIN', 'Entragada Totalmente'),
        ('ELI', 'Rechazada'),
    )
    nro_consecutivo = models.PositiveIntegerField(null=True)
    cliente = models.ForeignKey(ClienteBiable, related_name='cotizaciones', on_delete=models.PROTECT)
    contacto = models.ForeignKey(ContactoCliente, related_name='cotizaciones', on_delete=models.PROTECT)
    ciudad = models.ForeignKey(Ciudad, related_name='cotizaciones', on_delete=models.PROTECT)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='INI')
    version = models.PositiveIntegerField(default=1)

    class Meta:
        permissions = [
            ("list_cotizacioncomponente", "Can list cotizaciones componentes")
        ]


class ItemCotizacionComponente(TimeStampedModel):
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
