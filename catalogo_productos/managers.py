from django.db import models
from django.db.models import ExpressionWrapper, Sum, DecimalField, Value, F, Case, When


class ItemVentaCatalogoManager(models.Manager):
    def get_queryset(self):
        qs = super().get_queryset().select_related(
            'margen',
            'proveedor_importacion'
        ).annotate(
            tasa=ExpressionWrapper(
                F('margen__proveedor__moneda__cambio') * (
                        1 + (F('margen__proveedor__moneda__variacion') / 100)),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo=Case(
                When(origen='LP_INTRANET', then='costo_catalogo'),
                default='item_sistema_informacion__ultimo_costo'
            ),
            costo_sistema_informacion=Case(
                When(
                    item_sistema_informacion__unidad_medida_en_inventario=F('unidad_medida_en_inventario'),
                    then='item_sistema_informacion__ultimo_costo'
                ),
                default=0
            ),
            # Moneda Pesos Colombianos
            costo_cop=ExpressionWrapper(
                F('tasa') * F('margen__proveedor__factor_importacion') * F('costo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_cop_aereo=ExpressionWrapper(
                F('tasa') * F('margen__proveedor__factor_importacion_aereo') * F('costo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_a_usar=Case(
                When(
                    costo_sistema_informacion__gte=F('costo_cop'),
                    item_sistema_informacion__unidad_medida_en_inventario=F('unidad_medida_en_inventario'),
                    then='costo_sistema_informacion'
                ),
                default='costo_cop'
            ),
            costo_a_usar_aereo=Case(
                When(
                    costo_sistema_informacion__gte=F('costo_cop_aereo'),
                    item_sistema_informacion__unidad_medida_en_inventario=F('unidad_medida_en_inventario'),
                    then='costo_sistema_informacion'),
                default='costo_cop_aereo'
            ),
            precio_base=ExpressionWrapper(
                Sum(F('costo_a_usar') / (1 - (F('margen__margen_deseado') / 100))),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base_aereo=ExpressionWrapper(
                Sum(F('costo_a_usar_aereo') / (1 - (F('margen__margen_deseado') / 100))),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            rentabilidad=ExpressionWrapper(
                F('precio_base') - F('costo_cop'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            # Moneda Dólares Americanos
            tasa_usd=ExpressionWrapper(
                F('margen__proveedor__moneda__cambio_a_usd') * (
                        1 + (F('margen__proveedor__moneda__variacion_usd') / 100)),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_usd=ExpressionWrapper(
                F('tasa_usd') * F('margen__proveedor__factor_importacion') * F('costo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_usd_aereo=ExpressionWrapper(
                F('tasa_usd') * F('margen__proveedor__factor_importacion_aereo') * F('costo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_a_usar_usd=Case(
                When(
                    costo_sistema_informacion__gte=F('costo_cop'),
                    item_sistema_informacion__unidad_medida_en_inventario=F('unidad_medida_en_inventario'),
                    then=(F('costo_sistema_informacion') / F('margen__proveedor__moneda__cambio')) * F('tasa_usd')
                ),
                default='costo_usd'
            ),
            costo_a_usar_aereo_usd=Case(
                When(
                    costo_sistema_informacion__gte=F('costo_cop_aereo'),
                    item_sistema_informacion__unidad_medida_en_inventario=F('unidad_medida_en_inventario'),
                    then=(F('costo_sistema_informacion') / F('margen__proveedor__moneda__cambio')) * F('tasa_usd')
                ),
                default='costo_usd_aereo'
            ),
            precio_base_usd=ExpressionWrapper(
                Sum(F('costo_a_usar_usd') / (1 - (F('margen__margen_deseado') / 100))),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base_aereo_usd=ExpressionWrapper(
                Sum(F('costo_a_usar_aereo_usd') / (1 - (F('margen__margen_deseado') / 100))),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
        ).all()
        return qs
