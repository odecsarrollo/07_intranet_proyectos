from cargues_detalles.models import MovimientoVentaDetalle, FacturaDetalle


def set_afecta_ingreso_movimiento_venta(
        movimiento_venta_id: int,
        valor: bool,
):
    item_venta = MovimientoVentaDetalle.objects.get(pk=movimiento_venta_id)
    item_venta.no_afecta_ingreso = valor
    item_venta.save()


def cambiar_tipo_documento_nota_credito(
        factura_id: int,
        tipo_documento: str
):
    factura = FacturaDetalle.objects.get(pk=factura_id)

