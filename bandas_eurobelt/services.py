from .models import CategoriaDosComponenteBandaEurobelt, TipoBandaBandaEurobelt


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
