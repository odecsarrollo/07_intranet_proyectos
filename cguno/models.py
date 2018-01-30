from django.db import models
from proyectos.models import Literal


class ItemsBiable(models.Model):
    id_item = models.PositiveIntegerField(primary_key=True)
    id_referencia = models.CharField(max_length=20)
    descripcion = models.CharField(max_length=40)
    descripcion_dos = models.CharField(max_length=40)
    activo = models.BooleanField(default=True)
    nombre_tercero = models.CharField(max_length=120)
    desc_item_padre = models.CharField(max_length=40)
    unidad_medida_inventario = models.CharField(max_length=6)
    id_procedencia = models.CharField(max_length=1)
    ultimo_costo = models.DecimalField(max_digits=18, decimal_places=3, default=0)

    class Meta:
        verbose_name = 'Item'
        verbose_name_plural = 'Items'

    def __str__(self):
        return self.descripcion


class ItemsLiteralBiable(models.Model):
    item_biable = models.ForeignKey(ItemsBiable, on_delete=models.PROTECT)
    literal = models.ForeignKey(Literal, on_delete=models.PROTECT, verbose_name='mis_items_biable')
    cantidad = models.DecimalField(decimal_places=2, max_digits=10)
    costo_total = models.DecimalField(decimal_places=2, max_digits=12)

    class Meta:
        verbose_name = 'Item Literales Proyecto'
        verbose_name_plural = 'Items Literales Proyecto'
        unique_together = ['item_biable', 'literal']

    def __str__(self):
        return self.item_biable.descripcion
