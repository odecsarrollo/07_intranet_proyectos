from django.db import models
from cargues_catalogos.models import ItemsCatalogo, UnidadMedidaCatalogo
from catalogo_productos.managers import ItemVentaCatalogoManager
from importaciones.models import MargenProvedor, ProveedorImportacion
from sistema_informacion_origen.models import SistemaInformacionOrigen


class ItemVentaCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(
        SistemaInformacionOrigen,
        on_delete=models.PROTECT,
        null=True
    )
    item_id_temporal = models.BigIntegerField(null=True)
    item_sistema_informacion = models.ForeignKey(
        ItemsCatalogo,
        null=True,
        related_name='articulos_catalogo',
        on_delete=models.PROTECT
    )
    referencia_catalogo = models.CharField(max_length=100, null=True)
    nombre_catalogo = models.CharField(max_length=200, null=True)
    unidad_medida_en_inventario = models.ForeignKey(UnidadMedidaCatalogo, null=True, on_delete=models.PROTECT)
    costo_catalogo = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    proveedor_importacion = models.ForeignKey(
        ProveedorImportacion,
        related_name='articulos_catalogo',
        on_delete=models.PROTECT,
        null=True,
    )
    margen = models.ForeignKey(
        MargenProvedor,
        null=True,
        related_name="articulos_catalogo",
        on_delete=models.PROTECT
    )

    activo = models.BooleanField(default=True)
    origen = models.CharField(max_length=20, default='LP_INTRANET')
    id_procedencia = models.CharField(max_length=1, null=True, blank=True)
    unidades_disponibles = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    fecha_ultima_entrada = models.DateField(null=True)

    objects = ItemVentaCatalogoManager()

    class Meta:
        permissions = [
            ("list_itemventacatalogo", "Puede Listar Items Venta Catalogo")
        ]
