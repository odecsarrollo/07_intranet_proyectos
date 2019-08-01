from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel

from cguno.models import ItemsBiable
from items.models import CategoriaProducto
from importaciones.models import ProveedorImportacion, MargenProvedor


class ConfiguracionBandaEurobelt(models.Model):
    fabricante = models.ForeignKey(
        ProveedorImportacion,
        on_delete=models.PROTECT,
        null=True
    )
    categoria_aleta = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.PROTECT,
        related_name='configuracion_banda_eurobelt_aleta',
        null=True
    )
    categoria_empujador = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.PROTECT,
        related_name='configuracion_banda_eurobelt_empujador',
        null=True
    )
    categoria_varilla = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.PROTECT,
        related_name='configuracion_banda_eurobelt_varilla',
        null=True
    )
    categoria_banda = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.PROTECT,
        related_name='configuracion_banda_eurobelt_banda',
        null=True
    )
    categoria_tapa = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.PROTECT,
        related_name='configuracion_banda_eurobelt_tapa',
        null=True
    )
    categoria_modulo = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.PROTECT,
        related_name='configuracion_banda_eurobelt_modulo',
        null=True
    )


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
    margen = models.ForeignKey(MargenProvedor, on_delete=models.PROTECT, related_name='ensamblados', null=True)
    categoria = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.PROTECT,
        related_name='componentes'
    )
    categoria_dos = models.ForeignKey(
        CategoriaDosComponenteBandaEurobelt,
        on_delete=models.PROTECT,
        related_name='componentes'
    )
    color = models.ForeignKey(ColorBandaEurobelt, on_delete=models.PROTECT, related_name='componentes', null=True)
    series_compatibles = models.ManyToManyField(SerieBandaEurobelt, related_name='componentes')
    tipo_banda = models.ForeignKey(
        TipoBandaBandaEurobelt,
        on_delete=models.PROTECT,
        related_name='componentes',
        null=True
    )
    ancho = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    alto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    largo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    diametro = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    item_cguno = models.ForeignKey(ItemsBiable, null=True, on_delete=models.PROTECT, related_name='componente_banda')
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    @property
    def costo_cop(self):
        if self.margen:
            return round(self.margen.proveedor.moneda.cambio * self.margen.proveedor.factor_importacion * self.costo, 0)
        return 0

    @property
    def costo_cop_aereo(self):
        if self.margen:
            if self.margen.proveedor.factor_importacion_aereo > self.margen.proveedor.factor_importacion:
                return round(
                    self.margen.proveedor.moneda.cambio * self.margen.proveedor.factor_importacion_aereo * self.costo,
                    0)
        return 0

    @property
    def precio_base(self):
        if self.margen:
            return round(float(self.costo_cop) / float((1 - (self.margen.margen_deseado / 100))), 0)
        return 0

    @property
    def precio_base_aereo(self):
        if self.margen:
            return round(float(self.costo_cop_aereo) / float((1 - (self.margen.margen_deseado / 100))), 0)
        return 0

    @property
    def rentabilidad(self):
        if self.margen:
            return round(float(self.precio_base) - float(self.costo_cop), 0)
        return 0

    @property
    def nombre(self):
        nombre = self.categoria.nombre
        if self.categoria_dos:
            nombre = '%s %s' % (nombre, self.categoria_dos.nombre)
        if self.tipo_banda:
            nombre = '%s %s' % (nombre, self.tipo_banda.nombre)
        if self.material.nombre:
            nombre = '%s %s' % (nombre, self.material.nombre)
        if self.color.nombre:
            nombre = '%s %s' % (nombre, self.color.nombre)
        if self.descripcion_adicional:
            nombre = '%s %s' % (nombre, self.descripcion_adicional)
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


class BandaEurobeltCostoEnsamblado(models.Model):
    con_aleta = models.BooleanField(default=False)
    con_empujador = models.BooleanField(default=False)
    con_torneado = models.BooleanField(default=False)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        unique_together = ('con_aleta', 'con_empujador', 'con_torneado')


class BandaEurobelt(models.Model):
    ensamblado = models.ManyToManyField(
        ComponenteBandaEurobelt,
        through='EnsambladoBandaEurobelt',
        through_fields=('banda', 'componente'),
    )
    costo_ensamblado = models.ForeignKey(BandaEurobeltCostoEnsamblado, on_delete=models.PROTECT)
    serie = models.ForeignKey(SerieBandaEurobelt, on_delete=models.PROTECT, related_name='bandas')
    color = models.ForeignKey(ColorBandaEurobelt, on_delete=models.PROTECT, related_name='bandas')
    ancho = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    largo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    con_torneado_varilla = models.BooleanField(default=False)
    empujador_tipo = models.ForeignKey(
        TipoBandaBandaEurobelt,
        on_delete=models.PROTECT,
        related_name='bandas_con_empujadores',
        null=True
    )
    empujador_alto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    empujador_ancho = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    empujador_distanciado = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    empujador_identacion = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    empujador_filas_entre_empujador = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    empujador_filas_empujador = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    aleta_alto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    aleta_identacion = models.DecimalField(max_digits=10, decimal_places=2, default=0)


class EnsambladoBandaEurobelt(TimeStampedModel):
    banda = models.ForeignKey(BandaEurobelt, on_delete=models.CASCADE)
    componente = models.ForeignKey(ComponenteBandaEurobelt, on_delete=models.CASCADE)
    cortado_a = models.CharField(max_length=10, default="COMPLETA")
    cantidad = models.PositiveIntegerField()
    created_by = models.ForeignKey(User, null=True, related_name="ensamblado_created_by", on_delete=models.PROTECT)
    updated_by = models.ForeignKey(User, null=True, related_name="ensamblado_updated_by", on_delete=models.PROTECT)
