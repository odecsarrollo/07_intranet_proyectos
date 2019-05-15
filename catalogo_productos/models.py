from django.db import models
from cargues_catalogos.models import ItemsCatalogo
from importaciones.models import MargenProvedor, ProveedorImportacion
from sistema_informacion_origen.models import SistemaInformacionOrigen


class ItemVentaCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(
        SistemaInformacionOrigen,
        on_delete=models.PROTECT,
        null=True
    )
    item_sistema_informacion = models.ForeignKey(
        ItemsCatalogo,
        null=True,
        related_name='articulos_catalogo',
        on_delete=models.PROTECT
    )
    referencia_catalogo = models.CharField(max_length=100, null=True)
    nombre_catalogo = models.CharField(max_length=200, null=True)
    unidad_medida_catalogo = models.CharField(max_length=100, null=True)
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

    class Meta:
        permissions = [
            ("list_itemventacatalogo", "Puede Listar Items Venta Catalogo")
        ]

    @property
    def costo(self):
        if self.origen == 'LP_INTRANET':
            costo = self.costo_catalogo
        else:
            costo = self.item_sistema_informacion.ultimo_costo
        return costo

    def get_costo_cop(self):
        if self.margen:
            return round(self.margen.proveedor.moneda.cambio * self.margen.proveedor.factor_importacion * self.costo, 0)
        return 0

    def get_costo_cop_aereo(self):
        if self.margen:
            return round(
                self.margen.proveedor.moneda.cambio * self.margen.proveedor.factor_importacion_aereo * self.costo, 0)
        return 0

    def get_precio_base(self):
        if self.margen:
            return round(self.get_costo_cop() / (1 - (self.margen.margen_deseado / 100)), 0)
        return 0

    def get_precio_base_aereo(self):
        if self.margen:
            if self.margen.proveedor.factor_importacion_aereo > self.margen.proveedor.factor_importacion:
                return round(self.get_costo_cop_aereo() / (1 - (self.margen.margen_deseado / 100)), 0)
        return 0

    def get_rentabilidad(self):
        if self.margen:
            return round(self.get_precio_base() - self.get_costo_cop(), 0)
        return 0
