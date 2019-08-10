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
        id_item: int = None,
        item_descripcion: str = None,
        item_referencia: str = None,
        item_unidad_medida: str = None,
) -> CotizacionComponente:
    if (
            id_item is None or tipo_item == 'Otro') and item_descripcion is None and item_referencia is None and item_unidad_medida is None:
        raise ValidationError({
            '_error': 'Si es un item que no esta en la lista de precios, debe de ingresar la descripción, referencia y unidad de medida'
        })
    cotizacion_componente = CotizacionComponente.objects.get(pk=cotizacion_componente_id)
    item = ItemCotizacionComponente()
    descripcion = ''
    referencia = ''
    unidad_medida = ''
    if tipo_item == 'BandaEurobelt':
        banda_eurobelt = BandaEurobelt.objects.get(pk=id_item)
        item.banda_eurobelt = banda_eurobelt
        descripcion = banda_eurobelt.nombre
        referencia = banda_eurobelt.referencia
    if tipo_item == 'ArticuloCatalogo':
        articulo_catalogo = ItemVentaCatalogo.objects.get(pk=id_item)
        item.articulo_catalogo = articulo_catalogo
        descripcion = articulo_catalogo.nombre_catalogo
        referencia = articulo_catalogo.referencia_catalogo
        unidad_medida = articulo_catalogo.unidad_medida_catalogo
    if tipo_item == 'ComponenteEurobelt':
        componente_eurobelt = ComponenteBandaEurobelt.objects.get(pk=id_item)
        item.componente_eurobelt = componente_eurobelt
        descripcion = componente_eurobelt.nombre
    if tipo_item == 'Otro':
        descripcion = item_descripcion
        referencia = item_referencia
        unidad_medida = item_unidad_medida

    item.descripcion = descripcion
    item.unidad_medida = unidad_medida
    item.referencia = referencia
    item.cotizacion = cotizacion_componente
    item.cantidad = 0
    item.precio_unitario = 0
    item.valor_total = 0
    item.save()
    return cotizacion_componente
