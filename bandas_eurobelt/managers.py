from django.db import models
from django.db.models import ExpressionWrapper, Sum, DecimalField, Subquery, OuterRef, F


class ComponenteManager(models.Manager):
    def get_queryset(self):
        qs = super().get_queryset().select_related(
            'categoria',
            'tipo_banda',
            'material',
            'color',
            'categoria_dos',
            'margen',
            'margen__proveedor',
            'margen__proveedor__moneda',
        ).prefetch_related(
            'series_compatibles',
        ).annotate(
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


class BandaEurobeltManager(models.Manager):
    def get_queryset(self):
        from bandas_eurobelt.models import EnsambladoBandaEurobelt
        componentes = EnsambladoBandaEurobelt.objects.values(
            'banda_id'
        ).annotate(
            cantidad_componentes=Sum('cantidad'),
            costo_cop=ExpressionWrapper(
                Sum(
                    F('cantidad') *
                    F('componente__margen__proveedor__moneda__cambio') *
                    F('componente__margen__proveedor__factor_importacion') *
                    F('componente__costo')
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base=ExpressionWrapper(
                Sum(
                    (
                            F('cantidad') *
                            F('componente__margen__proveedor__moneda__cambio') *
                            F('componente__margen__proveedor__factor_importacion') *
                            F('componente__costo')
                    ) / (1 - (F('componente__margen__margen_deseado') / 100))
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            )
        ).filter(banda_id=OuterRef('id'))

        qs = super().get_queryset().prefetch_related(
            'ensamblado'
        ).annotate(
            cantidad_componentes=Subquery(componentes.values('cantidad_componentes')),
            costo_cop=Subquery(componentes.values('costo_cop')),
            precio_base=Subquery(componentes.values('precio_base')),
        ).annotate(
            precio_mano_obra=ExpressionWrapper(
                F('precio_base') * (F('costo_ensamblado__porcentaje') / 100),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_con_mano_obra=ExpressionWrapper(
                F('precio_base') + F('precio_mano_obra'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            rentabilidad=ExpressionWrapper(
                F('precio_con_mano_obra') - F('costo_cop'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            )
        ).all()
        return qs
