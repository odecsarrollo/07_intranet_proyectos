from django.db.models import Max
from rest_framework.exceptions import ValidationError

from .models import CotizacionComponente, ItemCotizacionComponente
from catalogo_productos.models import ItemVentaCatalogo
from bandas_eurobelt.models import BandaEurobelt, ComponenteBandaEurobelt


def contizacion_componentes_asignar_nro_consecutivo(
        cotizacion_componente_id: int
) -> CotizacionComponente:
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    if cotizacion_componente.nro_consecutivo is not None:
        raise ValidationError(
            {'_error': 'Esta cotización ya tiene el número consecutivo %s' % cotizacion_componente.nro_consecutivo})
    max_nro_consecutivo = CotizacionComponente.objects.aggregate(max_nro_consecutivo=Max('nro_consecutivo'))[
        'max_nro_consecutivo']
    cotizacion_componente.nro_consecutivo = max_nro_consecutivo
    cotizacion_componente.save()
    return cotizacion_componente


def contizacion_componentes_adicionar_item(
        tipo_item: str,
        cotizacion_componente_id: int,
        precio_unitario: float,
        item_descripcion: str,
        item_referencia: str,
        item_unidad_medida: str,
        forma_pago_id: int = None,
        id_item: int = None,
) -> CotizacionComponente:
    if (
            id_item is None or tipo_item == 'Otro') and item_descripcion is None and item_referencia is None and item_unidad_medida is None:
        raise ValidationError({
            '_error': 'Si es un item que no esta en la lista de precios, debe de ingresar la descripción, referencia y unidad de medida'
        })
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    item = ItemCotizacionComponente()
    if tipo_item == 'BandaEurobelt':
        banda_eurobelt = BandaEurobelt.objects.get(pk=id_item)
        item.banda_eurobelt = banda_eurobelt
    if tipo_item == 'ArticuloCatalogo':
        articulo_catalogo = ItemVentaCatalogo.objects.get(pk=id_item)
        item.articulo_catalogo = articulo_catalogo
    if tipo_item == 'ComponenteEurobelt':
        componente_eurobelt = ComponenteBandaEurobelt.objects.get(pk=id_item)
        item.componente_eurobelt = componente_eurobelt

    item.descripcion = item_descripcion
    item.referencia = item_referencia
    item.unidad_medida = item_unidad_medida
    item.cotizacion = cotizacion_componente
    item.cantidad = 1
    item.precio_unitario = precio_unitario
    item.valor_total = precio_unitario
    item.forma_pago_id = forma_pago_id
    item.save()
    return cotizacion_componente


def cotizacion_componentes_item_actualizar_item(
        item_componente_id: int,
        cantidad: float
) -> ItemCotizacionComponente:
    item = ItemCotizacionComponente.objects.get(pk=item_componente_id)
    item.cantidad = cantidad
    item.valor_total = cantidad * item.precio_unitario
    item.save()
    return item
