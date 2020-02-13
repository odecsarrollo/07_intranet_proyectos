from django.contrib.auth.models import User
from django.db import models
from model_utils.models import TimeStampedModel

from bandas_eurobelt.managers import ComponenteManager, BandaEurobeltManager
from cargues_catalogos.models import ItemsCatalogo
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
    categorias = models.ManyToManyField(
        CategoriaProducto,
        related_name='tipos_eurobelt',
        through='TipoBandaCategoriaProducto',
        through_fields=('tipo', 'categoria')
    )

    class Meta:
        permissions = [
            ("list_tipobandabandaeurobelt", "Can see list tipos bandas eurobelt"),
        ]


class TipoBandaCategoriaProducto(models.Model):
    categoria = models.ForeignKey(CategoriaProducto, related_name='tipos_bandas', on_delete=models.PROTECT)
    tipo = models.ForeignKey(TipoBandaBandaEurobelt, on_delete=models.PROTECT, related_name='categorias_productos')


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
    item_sistema_informacion = models.ForeignKey(
        ItemsCatalogo,
        null=True,
        on_delete=models.PROTECT,
        related_name='componente_banda'
    )
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nombre = models.CharField(max_length=400, null=True)
    objects = ComponenteManager()

    def set_nombre(self):
        nombre = self.categoria.nombre
        if self.categoria_dos:
            nombre = '%s %s' % (nombre, self.categoria_dos.nombre)
        if self.tipo_banda:
            nombre = '%s %s' % (nombre, self.tipo_banda.nombre)
        if self.material:
            nombre = '%s %s' % (nombre, self.material.nombre)
        if self.color:
            nombre = '%s %s' % (nombre, self.color.nombre)
        if self.descripcion_adicional:
            nombre = '%s %s' % (nombre, self.descripcion_adicional)
        if self.ancho > 0:
            nombre = '%s W%s' % (nombre, round(self.ancho))
        if self.alto > 0:
            nombre = '%s H%s' % (nombre, round(self.alto))
        if self.largo > 0:
            nombre = '%s L%s' % (nombre, round(self.largo))
        if self.series_compatibles.count() > 0:
            nombre = '%s ' % nombre
            ultima_serie = self.series_compatibles.last()
            for serie in self.series_compatibles.all():
                if serie == ultima_serie:
                    nombre = '%s%s' % (nombre, serie.nomenclatura)
                else:
                    nombre = '%s%s/' % (nombre, serie.nomenclatura)
        self.nombre = nombre.title()
        self.save()

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
    componentes = models.ManyToManyField(
        ComponenteBandaEurobelt,
        through='EnsambladoBandaEurobelt',
        through_fields=('banda', 'componente'),
    )
    referencia = models.CharField(max_length=100, null=True)
    nombre = models.CharField(max_length=300, null=True)
    con_empujador = models.BooleanField(default=False)
    con_aleta = models.BooleanField(default=False)
    con_torneado_varilla = models.BooleanField(default=False)
    costo_ensamblado = models.ForeignKey(BandaEurobeltCostoEnsamblado, on_delete=models.PROTECT)
    serie = models.ForeignKey(SerieBandaEurobelt, on_delete=models.PROTECT, related_name='bandas')
    color = models.ForeignKey(ColorBandaEurobelt, on_delete=models.PROTECT, related_name='bandas')
    material = models.ForeignKey(MaterialBandaEurobelt, on_delete=models.PROTECT, related_name='bandas')
    ancho = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    largo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tipo = models.ForeignKey(
        TipoBandaBandaEurobelt,
        on_delete=models.PROTECT,
        related_name='bandas',
        null=True
    )
    empujador_tipo = models.ForeignKey(
        TipoBandaBandaEurobelt,
        on_delete=models.PROTECT,
        related_name='bandas_con_empujadores',
        null=True
    )
    empujador_alto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    empujador_ancho = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    empujador_distanciado = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    empujador_identacion = models.CharField(max_length=100)
    empujador_filas_entre_empujador = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    empujador_filas_empujador = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    aleta_alto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    aleta_identacion = models.CharField(max_length=100)
    objects = BandaEurobeltManager()

    def set_referencia_nombre(self):
        categoria_varilla = ConfiguracionBandaEurobelt.objects.first().categoria_varilla
        varilla = self.ensamblado.filter(componente__categoria_id=categoria_varilla.id).first().componente

        referencia = 'BEU-%s%s%s%s%sW%s' % (
            self.serie.nomenclatura,
            self.tipo.nomenclatura,
            self.material.nomenclatura,
            self.color.nomenclatura,
            '%s%s' % ('V', varilla.material.nomenclatura) if varilla is not None else '',
            int(self.ancho)
        )

        nombre = 'Banda %s %s %s %s %s W%s' % (
            self.serie.nombre,
            self.tipo.nombre,
            self.material.nombre,
            self.color.nombre,
            varilla.material.nombre if varilla is not None else '',
            int(self.ancho)
        )

        if self.con_empujador:
            referencia += '/E%sH%sW%sD%sI%s' % (
                self.empujador_tipo.nombre,
                int(self.empujador_alto),
                int(self.empujador_ancho),
                int(self.empujador_distanciado),
                self.empujador_identacion
            )

            nombre += ' con Empujador %s H%s W%s D%s I%s' % (
                self.empujador_tipo.nombre,
                int(self.empujador_alto),
                int(self.empujador_ancho),
                int(self.empujador_distanciado),
                self.empujador_identacion
            )
        if self.con_aleta:
            referencia += '/AH%sI%s' % (
                int(self.aleta_alto),
                self.aleta_identacion
            )
            nombre += ' con Aleta H%s I%s' % (
                int(self.aleta_alto),
                self.aleta_identacion
            )

        self.referencia = referencia
        self.nombre = nombre.strip().title()
        self.save()

    class Meta:
        permissions = [
            ("list_bandaeurobelt", "Can see list bandas eurobelt"),
        ]


class EnsambladoBandaEurobelt(TimeStampedModel):
    banda = models.ForeignKey(BandaEurobelt, on_delete=models.CASCADE, related_name='ensamblado')
    componente = models.ForeignKey(ComponenteBandaEurobelt, on_delete=models.CASCADE, related_name='bandas')
    cortado_a = models.CharField(max_length=10, default="COMPLETA")
    cantidad = models.PositiveIntegerField()
    created_by = models.ForeignKey(User, null=True, related_name="ensamblado_created_by", on_delete=models.PROTECT)
    updated_by = models.ForeignKey(User, null=True, related_name="ensamblado_updated_by", on_delete=models.PROTECT)
