from django.db import models
from django.db.models import Sum, F, ExpressionWrapper, DecimalField, OuterRef, Subquery
from django.db.models.functions import Coalesce


class CotizacionManager(models.Manager):
    def get_queryset(self):
        cotizaciones_adicionales = super().get_queryset().model.objects.values('cotizacion_inicial__id').annotate(
            costo_presupuestado_cotizaciones=ExpressionWrapper(
                Sum('costo_presupuestado'),
                output_field=DecimalField(max_digits=4)
            ),
            valor_orden_compra_cotizaciones=ExpressionWrapper(
                Sum('valor_orden_compra'),
                output_field=DecimalField(max_digits=4)
            )
        ).filter(
            cotizacion_inicial__id=OuterRef('id'),
            estado='Cierre (Aprobado)'
        ).distinct()

        qs = super().get_queryset().select_related(
            'responsable',
            'created_by',
            'cliente',
            'contacto_cliente',
            'cotizacion_inicial',
        ).prefetch_related(
            'proyectos',
            'cotizaciones_adicionales'
        ).annotate(
            # costo_presupuestado_adicionales=Coalesce(Sum('cotizaciones_adicionales__costo_presupuestado'), 0),
            valor_orden_compra_adicionales=Coalesce(
                ExpressionWrapper(
                    Subquery(cotizaciones_adicionales.values('valor_orden_compra_cotizaciones')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            costo_presupuestado_adicionales=Coalesce(
                ExpressionWrapper(
                    Subquery(cotizaciones_adicionales.values('costo_presupuestado_cotizaciones')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            valor_total_orden_compra_cotizaciones=F('valor_orden_compra_adicionales') + F('valor_orden_compra')
        ).all()
        return qs
