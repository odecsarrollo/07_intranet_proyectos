from django.db import models

from model_utils.models import TimeStampedModel

from items.models import CategoriaProducto
import reversion


@reversion.register()
class MonedaCambio(models.Model):
    nombre = models.CharField(max_length=20, unique=True)
    cambio = models.DecimalField(max_digits=18, decimal_places=4, default=0)

    class Meta:
        permissions = [
            ['list_monedacambio', 'Puede listar monedas cambio'],
        ]


@reversion.register()
class ProveedorImportacion(TimeStampedModel):
    nombre = models.CharField(max_length=120, unique=True)
    moneda = models.ForeignKey(MonedaCambio, on_delete=models.PROTECT, related_name="provedores_con_moneda")
    factor_importacion = models.DecimalField(max_digits=18, decimal_places=3, default=1)
    factor_importacion_aereo = models.DecimalField(max_digits=18, decimal_places=3, default=0)
    proveedor_id_temporal = models.BigIntegerField(null=True)
    margenes = models.ManyToManyField(
        CategoriaProducto,
        through='MargenProvedor',
        through_fields=('proveedor', 'categoria')
    )

    class Meta:
        permissions = [
            ['list_proveedorimportacion', 'Puede listar proveedores importaciones'],
        ]


@reversion.register()
class MargenProvedor(TimeStampedModel):
    categoria = models.ForeignKey(
        CategoriaProducto,
        on_delete=models.CASCADE,
        related_name="margenes_por_proveedor"
    )
    proveedor = models.ForeignKey(
        ProveedorImportacion,
        on_delete=models.CASCADE,
        related_name="margenes_por_categoria"
    )
    margen_deseado = models.DecimalField(
        max_digits=18,
        decimal_places=3
    )
    margen_id_temporal = models.BigIntegerField(null=True)

    class Meta:
        unique_together = (['categoria', 'proveedor'])
        permissions = [
            ['list_margenprovedor', 'Puede listar margenes x proveedores'],
        ]
