from django.db import models
from model_utils.models import TimeStampedModel

from sistema_informacion_origen.models import SistemaInformacionOrigen

from cargues_catalogos.models import (
    CiudadCatalogo,
    SucursalCatalogo,
    ItemsCatalogo
)
from proyectos.models import Literal
from colaboradores.models import Colaborador
from clientes.models import ClienteBiable


class ItemsLiteralDetalle(models.Model):
    lapso = models.DateField()
    item = models.ForeignKey(ItemsCatalogo, on_delete=models.PROTECT)
    literal = models.ForeignKey(
        Literal,
        on_delete=models.CASCADE,
        verbose_name='items',
        related_name='materiales'
    )
    cantidad = models.DecimalField(decimal_places=4, max_digits=20, default=0)
    costo_total = models.DecimalField(decimal_places=4, max_digits=20, default=0)

    class Meta:
        unique_together = [('item', 'literal', 'lapso')]

    def __str__(self):
        return self.item.descripcion


class FacturaDetalle(TimeStampedModel):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    documento_id = models.BigIntegerField(null=True, db_index=True)
    ciudad = models.ForeignKey(CiudadCatalogo, null=True, on_delete=models.PROTECT)
    fecha_documento = models.DateField(null=True)
    direccion_despacho = models.CharField(max_length=400, null=True)
    tipo_documento = models.CharField(max_length=3, null=True)
    nro_documento = models.CharField(max_length=10, null=True)
    cliente = models.ForeignKey(ClienteBiable, on_delete=models.PROTECT, null=True, related_name='compras_componentes')
    colaborador = models.ForeignKey(Colaborador, on_delete=models.PROTECT, null=True, related_name='ventas_componentes')
    venta_bruta = models.DecimalField(max_digits=18, decimal_places=4)
    dscto_netos = models.DecimalField(max_digits=18, decimal_places=4)
    costo_total = models.DecimalField(max_digits=18, decimal_places=4)
    rentabilidad = models.DecimalField(max_digits=18, decimal_places=4)
    imp_netos = models.DecimalField(max_digits=18, decimal_places=4)
    venta_neto = models.DecimalField(max_digits=18, decimal_places=4)
    sucursal = models.ForeignKey(SucursalCatalogo, null=True, related_name='facturas', on_delete=models.PROTECT)
    activa = models.BooleanField(default=True)

    class Meta:
        unique_together = [('sistema_informacion', 'tipo_documento', 'nro_documento')]


class MovimientoVentaDetalle(models.Model):
    factura = models.ForeignKey(
        FacturaDetalle,
        null=True,
        related_name='items',
        on_delete=models.PROTECT
    )
    item = models.ForeignKey(ItemsCatalogo, null=True, related_name='ventas', on_delete=models.PROTECT)
    precio_uni = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    cantidad = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    venta_bruta = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    dscto_netos = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    costo_total = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    rentabilidad = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    imp_netos = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    venta_neto = models.DecimalField(max_digits=18, decimal_places=4, default=0)

    class Meta:
        unique_together = [('factura', 'item')]
