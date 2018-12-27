from django.db import models
from cguno.models import ItemsBiable


class Material(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    def __str__(self):
        return self.nombre


class TipoBanda(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    def __str__(self):
        return self.nombre


class Color(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    def __str__(self):
        return self.nombre


class Serie(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    def __str__(self):
        return self.nombre


class Componente(models.Model):
    CHOICES_TIPO = (
        ('ALETA', 'Aleta'),
        ('EMPUJADOR', 'Empujador'),
        ('MODULO', 'Modulo'),
        ('VARILLA', 'Varilla'),
        ('TAPA', 'Tapa'),
    )
    descripcion_adicional = models.CharField(max_length=100, null=True)
    tipo = models.CharField(choices=CHOICES_TIPO, max_length=200)
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name='componentes')
    color = models.ForeignKey(Color, on_delete=models.PROTECT, related_name='componentes', null=True)
    series_compatibles = models.ManyToManyField(Serie, related_name='componentes')
    tipo_banda = models.ForeignKey(TipoBanda, on_delete=models.PROTECT, related_name='componentes', null=True)
    ancho = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    alto = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    largo = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    diametro_varilla = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    item_cguno = models.ForeignKey(ItemsBiable, null=True, on_delete=models.PROTECT, related_name='componente_banda')
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        nombre = self.tipo
        if self.tipo_banda:
            nombre = '%s %s' % (nombre, self.tipo_banda.nombre)
        if self.material.nombre:
            nombre = '%s %s' % (nombre, self.material.nombre)
        if self.color.nombre:
            nombre = '%s %s' % (nombre, self.color.nombre)
        return nombre


class GrupoEnsamblado(models.Model):
    color = models.ForeignKey(Color, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    material = models.ForeignKey(Material, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    serie = models.ForeignKey(Serie, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    tipo_banda = models.ForeignKey(TipoBanda, on_delete=models.PROTECT, related_name='grupos_ensamblados')
    componentes_compatibles = models.ManyToManyField(Componente, related_name='grupos_ensamblados')

    class Meta:
        unique_together = [('color', 'material', 'serie', 'tipo_banda')]
