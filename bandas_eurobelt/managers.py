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
            # Moneda Pesos Colombianos
            tasa=ExpressionWrapper(
                F('margen__proveedor__moneda__cambio') * (1 + (F('margen__proveedor__moneda__variacion') / 100)),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_cop=ExpressionWrapper(
                F('tasa') * F('margen__proveedor__factor_importacion') * F('costo'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_cop_aereo=ExpressionWrapper(
                F('tasa') * F('margen__proveedor__factor_importacion_aereo') * F('costo'),
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
            ),
            # Moneda Dolares Americanos
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
            precio_base_usd=ExpressionWrapper(
                Sum(F('costo_usd') / (1 - (F('margen__margen_deseado') / 100))),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base_usd_aereo=ExpressionWrapper(
                Sum(F('costo_usd_aereo') / (1 - (F('margen__margen_deseado') / 100))),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
        ).all()
        return qs


class BandaEurobeltManager(models.Manager):
    def get_queryset(self):
        from bandas_eurobelt.models import EnsambladoBandaEurobelt
        componentes = EnsambladoBandaEurobelt.objects.values(
            'banda_id'
        ).annotate(
            cantidad_componentes=Sum('cantidad'),
            tasa=ExpressionWrapper(
                F('componente__margen__proveedor__moneda__cambio') * (
                        1 + (F('componente__margen__proveedor__moneda__variacion') / 100)),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo=ExpressionWrapper(
                Sum(
                    F('cantidad') *
                    F('componente__costo')
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            # Moneda Pesos Colombianos
            costo_cop=ExpressionWrapper(
                Sum(
                    F('tasa') *
                    F('cantidad') *
                    F('componente__margen__proveedor__factor_importacion') *
                    F('componente__costo')
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_cop_aereo=ExpressionWrapper(
                Sum(
                    F('tasa') *
                    F('cantidad') *
                    F('componente__margen__proveedor__factor_importacion_aereo') *
                    F('componente__costo')
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base=ExpressionWrapper(
                Sum(
                    (
                            F('tasa') *
                            F('cantidad') *
                            F('componente__margen__proveedor__factor_importacion') *
                            F('componente__costo')
                    ) / (1 - (F('componente__margen__margen_deseado') / 100))
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base_aereo=ExpressionWrapper(
                Sum(
                    (
                            F('tasa') *
                            F('cantidad') *
                            F('componente__margen__proveedor__factor_importacion_aereo') *
                            F('componente__costo')
                    ) / (1 - (F('componente__margen__margen_deseado') / 100))
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            # Moneda Dolares Americanos
            tasa_usd=ExpressionWrapper(
                F('componente__margen__proveedor__moneda__cambio_a_usd') * (
                        1 + (F('componente__margen__proveedor__moneda__variacion_usd') / 100)),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_usd=ExpressionWrapper(
                Sum(
                    F('tasa_usd') *
                    F('cantidad') *
                    F('componente__margen__proveedor__factor_importacion') *
                    F('componente__costo')
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_usd_aereo=ExpressionWrapper(
                Sum(
                    F('tasa_usd') *
                    F('cantidad') *
                    F('componente__margen__proveedor__factor_importacion_aereo') *
                    F('componente__costo')
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base_usd=ExpressionWrapper(
                Sum(
                    (
                            F('tasa_usd') *
                            F('cantidad') *
                            F('componente__margen__proveedor__factor_importacion') *
                            F('componente__costo')
                    ) / (1 - (F('componente__margen__margen_deseado') / 100))
                ),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_base_usd_aereo=ExpressionWrapper(
                Sum(
                    (
                            F('tasa_usd') *
                            F('cantidad') *
                            F('componente__margen__proveedor__factor_importacion_aereo') *
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
            # Moneda Pesos Colombianos
            costo_cop=Subquery(componentes.values('costo_cop')),
            costo_cop_aereo=Subquery(componentes.values('costo_cop_aereo')),
            precio_base=Subquery(componentes.values('precio_base')),
            precio_base_aereo=Subquery(componentes.values('precio_base_aereo')),
            # Moneda Dolares Americanos
            costo_usd=Subquery(componentes.values('costo_usd')),
            costo_usd_aereo=Subquery(componentes.values('costo_usd_aereo')),
            precio_base_usd=Subquery(componentes.values('precio_base_usd')),
            precio_base_usd_aereo=Subquery(componentes.values('precio_base_usd_aereo')),
            moneda_tasa_usd=Subquery(componentes.values('tasa_usd')),
            moneda_tasa=Subquery(componentes.values('tasa'))
        ).annotate(
            costo=ExpressionWrapper(
                Subquery(componentes.values('costo')) * (F('costo_ensamblado__porcentaje') / 100),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            # Moneda Pesos Colombianos
            precio_mano_obra=ExpressionWrapper(
                F('precio_base') * (F('costo_ensamblado__porcentaje') / 100),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_cop_mano_obra=ExpressionWrapper(
                F('costo_cop') + F('precio_mano_obra'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_cop_aereo_mano_obra=ExpressionWrapper(
                F('costo_cop_aereo') + F('precio_mano_obra'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_con_mano_obra_aereo=ExpressionWrapper(
                F('precio_base_aereo') + F('precio_mano_obra'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_con_mano_obra=ExpressionWrapper(
                F('precio_base') + F('precio_mano_obra'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            rentabilidad=ExpressionWrapper(
                F('precio_con_mano_obra') - F('costo_cop'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            # Moneda Dolares Americanos
            precio_mano_obra_usd=ExpressionWrapper(
                F('precio_base_usd') * (F('costo_ensamblado__porcentaje') / 100),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_usd_mano_obra=ExpressionWrapper(
                F('costo_usd') + F('precio_mano_obra_usd'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_con_mano_obra_usd=ExpressionWrapper(
                F('precio_base_usd') + F('precio_mano_obra_usd'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            costo_usd_aereo_mano_obra=ExpressionWrapper(
                F('costo_usd_aereo') + F('precio_mano_obra_usd'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
            precio_con_mano_obra_aereo_usd=ExpressionWrapper(
                F('precio_base_usd_aereo') + F('precio_mano_obra_usd'),
                output_field=DecimalField(max_digits=12, decimal_places=2)
            ),
        ).all()
        return qs
