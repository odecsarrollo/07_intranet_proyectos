from django.db import models
from django.db.models import ExpressionWrapper, Sum, DecimalField, Value, F, Case, When


class CotizacionComponenteManager(models.Manager):
    def get_queryset(self):
        qs = super().get_queryset().select_related(
            'cliente',
            'ciudad',
            'ciudad__departamento',
            'ciudad__departamento__pais',
            'contacto',
            'contacto__creado_por'
        ).prefetch_related(
            'items',
            'items__forma_pago',
            'items__forma_pago__canal',
        ).annotate(
            valor_total=Sum('items__valor_total'),
            cantidad_items=Sum('items__cantidad')
        ).all()
        return qs
