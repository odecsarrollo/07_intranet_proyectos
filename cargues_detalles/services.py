from cargues_detalles.models import MovimientoVentaDetalle


def set_afecta_ingreso_movimiento_venta(
        movimiento_venta_id: int,
        valor: bool,
):
    item_venta = MovimientoVentaDetalle.objects.get(pk=movimiento_venta_id)
    item_venta.no_afecta_ingreso = valor
    item_venta.save()
