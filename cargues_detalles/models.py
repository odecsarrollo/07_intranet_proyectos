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
from cargues_catalogos.models import UnidadMedidaCatalogo


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
    nro_documento = models.CharField(max_length=10, null=True)
    cliente = models.ForeignKey(ClienteBiable, on_delete=models.PROTECT, null=True, related_name='compras_componentes')
    colaborador = models.ForeignKey(
        Colaborador,
        on_delete=models.PROTECT,
        null=True,
        related_name='ventas_vendedor_original'
    )
    colaborador_original = models.ForeignKey(
        Colaborador,
        on_delete=models.PROTECT, null=True,
        related_name='ventas_vendedor_sistema'
    )
    tipo_documento = models.CharField(max_length=3, null=True)
    tipo_documento_original = models.CharField(max_length=3, null=True)
    venta_bruta = models.DecimalField(max_digits=18, decimal_places=4)
    dscto_netos = models.DecimalField(max_digits=18, decimal_places=4)
    costo_total = models.DecimalField(max_digits=18, decimal_places=4)
    rentabilidad = models.DecimalField(max_digits=18, decimal_places=4)
    imp_netos = models.DecimalField(max_digits=18, decimal_places=4)
    venta_neto = models.DecimalField(max_digits=18, decimal_places=4)
    sucursal = models.ForeignKey(SucursalCatalogo, null=True, related_name='facturas', on_delete=models.PROTECT)
    activa = models.BooleanField(default=True)
    no_afecta_ingreso = models.BooleanField(default=False)

    class Meta:
        unique_together = [('sistema_informacion', 'tipo_documento_original', 'nro_documento')]
        permissions = [
            ("list_facturadetalle", "Can list factura detalle"),
            ("see_costos_facturadetalle", "Can see costos factura detalle"),
            ("see_rentabilidad_facturadetalle", "Can see rentabilidad factura detalle"),
            ("see_descuentos_facturadetalle", "Can see descuentos factura detalle"),
            ("relacionar_cotizacion_componentes_facturadetalle", "Can relacionar cotizacion componentes"),
            ("set_no_afecta_ingreso_facturadetalle", "Definir si afecta ingreso factura detalle"),
        ]


class MovimientoVentaDetalle(models.Model):
    factura = models.ForeignKey(
        FacturaDetalle,
        null=True,
        related_name='items',
        on_delete=models.PROTECT
    )
    item = models.ForeignKey(ItemsCatalogo, null=True, related_name='ventas', on_delete=models.PROTECT)
    unidad_medida = models.ForeignKey(UnidadMedidaCatalogo, null=True, related_name='ventas', on_delete=models.PROTECT)
    precio_uni = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    cantidad = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    venta_bruta = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    dscto_netos = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    costo_total = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    rentabilidad = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    imp_netos = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    venta_neto = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    no_afecta_ingreso = models.BooleanField(default=False)

    class Meta:
        unique_together = [('factura', 'item')]
        permissions = [
            ("list_movimientoventadetalle", "Can list movimiento venta detalle"),
            ("see_costos_movimientoventadetalle", "Can see movimiento venta detalle"),
            ("see_rentabilidad_movimientoventadetalle", "Can see movimiento venta detalle"),
            ("see_descuentos_movimientoventadetalle", "Can see movimiento venta detalle"),
            ("set_no_afecta_ingreso_movimientoventadetalle", "Definir si afecta ingreso movimiento venta detalle"),
        ]
