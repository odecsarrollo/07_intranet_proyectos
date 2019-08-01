from .models import CategoriaProducto


def categoria_producto_adicionar_quitar_relacion_tipo_banda_eurobelt(
        categoria_producto_id: int,
        tipo_banda_id: int
) -> CategoriaProducto:
    categoria_producto = CategoriaProducto.objects.get(pk=categoria_producto_id)
    if categoria_producto.tipos_eurobelt.filter(pk=tipo_banda_id).exists():
        categoria_producto.tipos_eurobelt.remove(tipo_banda_id)
    else:
        categoria_producto.tipos_eurobelt.add(tipo_banda_id)
    return categoria_producto


def categoria_producto_adicionar_quitar_relacion_categorias_dos_banda_eurobelt(
        categoria_producto_id: int,
        categoria_dos_id: int
) -> CategoriaProducto:
    categoria_producto = CategoriaProducto.objects.get(pk=categoria_producto_id)
    if categoria_producto.categorias_dos_eurobelt.filter(pk=categoria_dos_id).exists():
        categoria_producto.categorias_dos_eurobelt.remove(categoria_dos_id)
    else:
        categoria_producto.categorias_dos_eurobelt.add(categoria_dos_id)
    return categoria_producto