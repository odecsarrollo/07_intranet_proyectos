from rest_framework.exceptions import ValidationError

from importaciones.models import MargenProvedor
from items.models import CategoriaProducto
from .models import (
    CategoriaDosComponenteBandaEurobelt,
    TipoBandaBandaEurobelt,
    ComponenteBandaEurobelt,
    ConfiguracionBandaEurobelt
)


def categoria_dos_adicionar_quitar_relacion_categoria_producto(
        categoria_dos_id: int,
        categoria_producto_id
) -> CategoriaDosComponenteBandaEurobelt:
    categoria_dos = CategoriaDosComponenteBandaEurobelt.objects.get(pk=categoria_dos_id)
    if categoria_dos.categorias.filter(pk=categoria_producto_id).exists():
        categoria_dos.categorias.remove(categoria_producto_id)
    else:
        categoria_dos.categorias.add(categoria_producto_id)
    return categoria_dos


def tipos_banda_adicionar_quitar_relacion_categoria_producto(
        tipo_banda_id: int,
        categoria_producto_id
) -> TipoBandaBandaEurobelt:
    tipo_banda = TipoBandaBandaEurobelt.objects.get(pk=tipo_banda_id)
    if tipo_banda.categorias.filter(pk=categoria_producto_id).exists():
        tipo_banda.categorias.remove(categoria_producto_id)
    else:
        tipo_banda.categorias.add(categoria_producto_id)
    return tipo_banda


def componente_banda_eurobelt_adicionar_quitar_serie_compatible(
        componente_id: int,
        serie_id: int
) -> ComponenteBandaEurobelt:
    componente = ComponenteBandaEurobelt.objects.get(pk=componente_id)
    serie_en_compatibles = componente.series_compatibles.filter(pk=serie_id)
    if serie_en_compatibles.exists():
        componente.series_compatibles.remove(serie_id)
    else:
        componente.series_compatibles.add(serie_id)
    componente = ComponenteBandaEurobelt.objects.get(pk=componente_id)
    return componente


def componente_banda_eurobelt_crear_actualizar(
        referencia: str,
        material_id: int,
        categoria_id: int,
        categoria_dos_id: int,
        color_id: int,
        tipo_banda_id: int,
        ancho: float,
        alto: float,
        largo: float,
        diametro: float,
        costo: float,
        descripcion_adicional: str = None,
        componente_id: int = None,
) -> ComponenteBandaEurobelt:
    if componente_id:
        componente = ComponenteBandaEurobelt.objects.get(pk=componente_id)
    else:
        componente = ComponenteBandaEurobelt()

    configuracion_banda_eurobelt = ConfiguracionBandaEurobelt.objects.first()
    margenes = MargenProvedor.objects.filter(
        proveedor=configuracion_banda_eurobelt.fabricante,
        categoria_id=categoria_id
    )

    if not margenes.exists():
        categoria = CategoriaProducto.objects.get(pk=categoria_id)
        raise ValidationError(
            {'_error': 'No existe margenes para la categoría %s con el proveedor %s' % (
                categoria.nombre, configuracion_banda_eurobelt.fabricante.nombre)})

    componente.margen = margenes.first()
    componente.referencia = referencia
    componente.categoria_id = categoria_id
    componente.material_id = material_id
    componente.categoria_dos_id = categoria_dos_id
    componente.color_id = color_id
    componente.tipo_banda_id = tipo_banda_id
    componente.ancho = ancho
    componente.alto = alto
    componente.largo = largo
    componente.diametro = diametro
    componente.costo = costo
    componente.descripcion_adicional = descripcion_adicional
    componente.save()
    return componente
