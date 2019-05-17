from django.db import models

from cguno.models import ItemsBiable
from importaciones.models import MonedaCambio
from items.models import CategoriaProducto


class ConfiguracionNombreAutomatico(models.Model):
    categoria = models.OneToOneField(
        CategoriaProducto,
        on_delete=models.PROTECT,
        null=True,
        related_name='nombre_automatico_erobelt'
    )
    nombre_con_categoria_uno = models.BooleanField(default=False)
    nombre_con_categoria_dos = models.BooleanField(default=False)
    nombre_con_tipo = models.BooleanField(default=False)
    nombre_con_serie = models.BooleanField(default=False)
    nombre_con_material = models.BooleanField(default=False)
    nombre_con_color = models.BooleanField(default=False)
    nombre_con_ancho = models.BooleanField(default=False)
    nombre_con_alto = models.BooleanField(default=False)
    nombre_con_longitud = models.BooleanField(default=False)
    nombre_con_diametro = models.BooleanField(default=False)


class CategoriaDosComponenteBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    categorias = models.ManyToManyField(CategoriaProducto, related_name='categorias_dos_eurobelt')

    class Meta:
        permissions = [
            ("list_categoriadoscomponentebandaeurobelt", "Can see list categorias dos eurobelt"),
        ]


class MaterialBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    class Meta:
        permissions = [
            ("list_materialbandaeurobelt", "Can see list materiales bandas eurobelt"),
        ]


class TipoBandaBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)
    categorias = models.ManyToManyField(CategoriaProducto, related_name='tipos_eurobelt')

    class Meta:
        permissions = [
            ("list_tipobandabandaeurobelt", "Can see list tipos bandas eurobelt"),
        ]


class ColorBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    class Meta:
        permissions = [
            ("list_colorbandaeurobelt", "Can see list colores bandas eurobelt"),
        ]


class SerieBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    class Meta:
        permissions = [
            ("list_seriebandaeurobelt", "Can see list series bandas eurobelt"),
        ]


class ComponenteBandaEurobelt(models.Model):
    referencia = models.CharField(max_length=100, null=True)
    descripcion_adicional = models.CharField(max_length=100, null=True)
    material = models.ForeignKey(MaterialBandaEurobelt, on_delete=models.PROTECT, related_name='componentes')
    categoria_dos = models.ForeignKey(
        CategoriaDosComponenteBandaEurobelt,
        on_delete=models.PROTECT,
        related_name='componentes'
    )
    color = models.ForeignKey(ColorBandaEurobelt, on_delete=models.PROTECT, related_name='componentes', null=True)
    series_compatibles = models.ManyToManyField(SerieBandaEurobelt, related_name='componentes')
    tipo_banda = models.ForeignKey(TipoBandaBandaEurobelt, on_delete=models.PROTECT, related_name='componentes',
                                   null=True)
    ancho = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    alto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    largo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    diametro_varilla = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    item_cguno = models.ForeignKey(ItemsBiable, null=True, on_delete=models.PROTECT, related_name='componente_banda')
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        nombre = self.referencia
        if self.tipo_banda:
            nombre = '%s %s' % (nombre, self.tipo_banda.nombre)
        if self.material.nombre:
            nombre = '%s %s' % (nombre, self.material.nombre)
        if self.color.nombre:
            nombre = '%s %s' % (nombre, self.color.nombre)
        return nombre

    class Meta:
        permissions = [
            ("list_componentebandaeurobelt", "Can see list componentes bandas eurobelt"),
        ]


class GrupoEnsambladoBandaEurobelt(models.Model):
    color = models.ForeignKey(ColorBandaEurobelt, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    material = models.ForeignKey(MaterialBandaEurobelt, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    serie = models.ForeignKey(SerieBandaEurobelt, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    tipo_banda = models.ForeignKey(TipoBandaBandaEurobelt, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    componentes_compatibles = models.ManyToManyField(ComponenteBandaEurobelt, related_name='grupos_ensamblados')

    class Meta:
        unique_together = [('color', 'material', 'serie', 'tipo_banda')]
