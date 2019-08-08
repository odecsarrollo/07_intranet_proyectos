from django.db import models
from django.db.models import ExpressionWrapper, Sum, DecimalField, Value, F, Case, When


class ItemVentaCatalogoManager(models.Manager):
    def get_queryset(self):
        qs = super().get_queryset().select_related(
            'margen',
            'proveedor_importacion'
        ).annotate(
            costo=Case(
                When(origen='LP_INTRANET', then='costo_catalogo'),
                default='item_sistema_informacion__ultimo_costo'
            ),
            costo_cop=ExpressionWrapper(
                F('margen__proveedor__moneda__cambio') * F('margen__proveedor__factor_importacion') * F('costo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_cop_aereo=ExpressionWrapper(
                F('margen__proveedor__moneda__cambio') * F('margen__proveedor__factor_importacion_aereo') * F('costo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base=ExpressionWrapper(
                Sum(F('costo_cop') / (1 - (F('margen__margen_deseado') / 100))),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base_aereo=ExpressionWrapper(
                Sum(F('costo_cop_aereo') / (1 - (F('margen__margen_deseado') / 100))),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            rentabilidad=ExpressionWrapper(
                F('precio_base') - F('costo_cop'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            )
        ).all()
        return qs
