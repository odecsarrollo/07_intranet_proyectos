from django.db import models

from bandas_eurobelt.managers import ComponenteManager
from cguno.models import ItemsBiable
from importaciones.models import MonedaCambio


class CategoriaComponenteBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)
    moneda = models.ForeignKey(MonedaCambio, on_delete=models.PROTECT, related_name="categorias_bandas_eurobelt")
    factor_importacion = models.DecimalField(max_digits=18, decimal_places=3, default=1)
    factor_importacion_aereo = models.DecimalField(max_digits=18, decimal_places=3, default=0)
    margen_deseado = models.DecimalField(
        max_digits=18,
        decimal_places=3,
        default=0
    )
    nombre_con_categoria_uno = models.BooleanField(default=False)
    nombre_con_categoria_dos = models.BooleanField(default=False)
    nombre_con_serie = models.BooleanField(default=False)
    nombre_con_tipo = models.BooleanField(default=False)
    nombre_con_material = models.BooleanField(default=False)
    nombre_con_color = models.BooleanField(default=False)
    nombre_con_ancho = models.BooleanField(default=False)
    nombre_con_alto = models.BooleanField(default=False)
    nombre_con_longitud = models.BooleanField(default=False)
    nombre_con_diametro = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre


class MaterialBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    def __str__(self):
        return self.nombre


class TipoBandaBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    def __str__(self):
        return self.nombre


class ColorBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    def __str__(self):
        return self.nombre


class SerieBandaEurobelt(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    def __str__(self):
        return self.nombre


class ComponenteBandaEurobelt(models.Model):
    referencia = models.CharField(max_length=100, null=True)
    descripcion_adicional = models.CharField(max_length=100, null=True)
    material = models.ForeignKey(MaterialBandaEurobelt, on_delete=models.PROTECT, related_name='componentes')
    categoria = models.ForeignKey(
        CategoriaComponenteBandaEurobelt,
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
    objects = ComponenteManager()

    def __str__(self):
        nombre = self.referencia
        if self.tipo_banda:
            nombre = '%s %s' % (nombre, self.tipo_banda.nombre)
        if self.material.nombre:
            nombre = '%s %s' % (nombre, self.material.nombre)
        if self.color.nombre:
            nombre = '%s %s' % (nombre, self.color.nombre)
        return nombre


class GrupoEnsambladoBandaEurobelt(models.Model):
    color = models.ForeignKey(ColorBandaEurobelt, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    material = models.ForeignKey(MaterialBandaEurobelt, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    serie = models.ForeignKey(SerieBandaEurobelt, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    tipo_banda = models.ForeignKey(TipoBandaBandaEurobelt, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    componentes_compatibles = models.ManyToManyField(ComponenteBandaEurobelt, related_name='grupos_ensamblados')

    class Meta:
        unique_together = [('color', 'material', 'serie', 'tipo_banda')]
