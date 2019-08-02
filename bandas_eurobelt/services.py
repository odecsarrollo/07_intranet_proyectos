from rest_framework.exceptions import ValidationError

from importaciones.models import MargenProvedor
from items.models import CategoriaProducto
from .models import (
    CategoriaDosComponenteBandaEurobelt,
    TipoBandaBandaEurobelt,
    ComponenteBandaEurobelt,
    ConfiguracionBandaEurobelt,
    BandaEurobelt,
    BandaEurobeltCostoEnsamblado
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


def banda_eurobelt_crear_actualizar(
        con_aleta: bool,
        con_empujador: bool,
        con_torneado_varilla: bool,
        ancho: float,
        largo: float,
        tipo_id: int,
        serie_id: int,
        color_id: int,
        material_id: int,
        banda_eurobelt_id: int = None,
        aleta_alto: float = None,
        aleta_identacion: float = None,
        empujador_tipo_id: int = None,
        empujador_alto: float = None,
        empujador_ancho: float = None,
        empujador_distanciado: float = None,
        empujador_identacion: float = None,
        empujador_filas_entre_empujador: float = None,
        empujador_filas_empujador: float = None,
) -> BandaEurobelt:
    costo_ensamblado = BandaEurobeltCostoEnsamblado.objects.filter(
        con_aleta=con_aleta,
        con_torneado=con_torneado_varilla,
        con_empujador=con_empujador
    ).first()
    if banda_eurobelt_id:
        banda_eurobelt = BandaEurobelt.objects.get(pk=banda_eurobelt_id)
    else:
        banda_eurobelt = BandaEurobelt()
    banda_eurobelt.con_empujador = con_empujador
    banda_eurobelt.con_aleta = con_aleta
    banda_eurobelt.con_torneado_varilla = con_torneado_varilla
    banda_eurobelt.color_id = color_id
    banda_eurobelt.largo = largo
    banda_eurobelt.tipo_id = tipo_id
    banda_eurobelt.costo_ensamblado = costo_ensamblado
    banda_eurobelt.ancho = ancho
    banda_eurobelt.serie_id = serie_id
    banda_eurobelt.material_id = material_id
    if con_aleta:
        if aleta_alto is not None and aleta_identacion is not None and int(aleta_alto) != 0 and int(
                aleta_identacion) != 0:
            banda_eurobelt.aleta_alto = aleta_alto
            banda_eurobelt.aleta_identacion = aleta_identacion
        else:
            raise ValidationError({'_error': 'Una banda con aleta debe tener el Alto y la Identación de la Aleta'})
    else:
        banda_eurobelt.aleta_alto = 0
        banda_eurobelt.aleta_identacion = 0
    if con_empujador:
        if (
                empujador_tipo_id is not None and
                empujador_alto is not None and
                empujador_ancho is not None and
                empujador_distanciado is not None and
                empujador_identacion is not None and
                int(empujador_alto) != 0 and
                int(empujador_ancho) != 0 and
                int(empujador_distanciado) != 0 and
                int(empujador_identacion) != 0
        ):
            banda_eurobelt.empujador_tipo_id = empujador_tipo_id
            banda_eurobelt.empujador_alto = empujador_alto
            banda_eurobelt.empujador_ancho = empujador_ancho
            banda_eurobelt.empujador_distanciado = empujador_distanciado
            banda_eurobelt.empujador_identacion = empujador_identacion
            banda_eurobelt.empujador_filas_entre_empujador = empujador_filas_entre_empujador
            banda_eurobelt.empujador_filas_empujador = empujador_filas_empujador
        else:
            raise ValidationError(
                {'_error': 'Una banda con empujador debe tener el Alto, Tipo, Ancho e Identación'})
    else:
        banda_eurobelt.empujador_tipo = None
        banda_eurobelt.empujador_alto = 0
        banda_eurobelt.empujador_ancho = 0
        banda_eurobelt.empujador_distanciado = 0
        banda_eurobelt.empujador_identacion = 0
        banda_eurobelt.empujador_filas_entre_empujador = 0
        banda_eurobelt.empujador_filas_empujador = 0
    banda_eurobelt.save()
    return banda_eurobelt
