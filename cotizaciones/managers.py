from django.db import models
from django.db.models import DecimalField
from django.db.models import ExpressionWrapper
from django.db.models import Min
from django.db.models import OuterRef
from django.db.models import Subquery
from django.db.models import Sum
from django.db.models.functions import Coalesce


class CotizacionQuerySet(models.QuerySet):
    def _base_pagos(self):
        from cotizaciones.models import CotizacionPagoProyectadoAcuerdoPagoPago
        _pagos_cotizacion = CotizacionPagoProyectadoAcuerdoPagoPago.objects.values(
            'acuerdo_pago__orden_compra__cotizacion_id'
        ).filter(valor__gt=0).annotate(
            total=Sum('valor')
        ).filter(acuerdo_pago__orden_compra__cotizacion_id=OuterRef('id'))
        return _pagos_cotizacion

    def _base_cotizaciones(self):
        from cotizaciones.models import Cotizacion
        _cotizaciones_adicionales = Cotizacion.objects.values('cotizacion_inicial__id').annotate(
            costo_presupuestado_adicionales=Sum('costo_presupuestado'),
            valores_oc_adicionales=Coalesce(Sum('pagos_proyectados__valor_orden_compra'), 0),
            pagos_adicionales=ExpressionWrapper(
                Subquery(self._base_pagos().values('total')),
                output_field=DecimalField(max_digits=12, decimal_places=4)
            ),
        ).filter(
            cotizacion_inicial__id=OuterRef('id'),
            estado='Cierre (Aprobado)'
        ).distinct()
        return _cotizaciones_adicionales

    def detail(self):
        return self.select_related(
            'cliente',
            'contacto_cliente',
            'cotizacion_inicial__cliente',
            'cotizacion_inicial__contacto_cliente',
            'responsable'
        ).prefetch_related(
            'proyectos',
            'literales',
            'pagos_proyectados',
            'pagos_proyectados',
            'pagos_proyectados__acuerdos_pagos',
            'pagos_proyectados__acuerdos_pagos__pagos',
            'condiciones_inicio_cotizacion',
            'cotizacion_inicial__cotizaciones_adicionales',
            'cotizaciones_adicionales__contacto_cliente',
            'cotizaciones_adicionales__cotizaciones_adicionales',
            'mis_documentos__creado_por',
            'mis_seguimientos__creado_por',
        ).annotate(
            valores_oc=Coalesce(Sum('pagos_proyectados__valor_orden_compra'), 0),
            pagos=ExpressionWrapper(
                Subquery(self._base_pagos().values('total')),
                output_field=DecimalField(max_digits=12, decimal_places=4)
            ),
            valores_oc_adicionales=ExpressionWrapper(
                Subquery(self._base_cotizaciones().values('valores_oc_adicionales')),
                output_field=DecimalField(max_digits=12, decimal_places=4)
            ),
            costo_presupuestado_adicionales=ExpressionWrapper(
                Subquery(self._base_cotizaciones().values('costo_presupuestado_adicionales')),
                output_field=DecimalField(max_digits=12, decimal_places=4)
            ),
            pagos_adicionales=ExpressionWrapper(
                Subquery(self._base_cotizaciones().values('pagos_adicionales')),
                output_field=DecimalField(max_digits=12, decimal_places=4)
            ),
        )

    def list(self):
        return self.select_related(
            'cliente',
            'contacto_cliente',
            'responsable',
            'cotizacion_inicial',
            'cotizacion_inicial__cliente',
            'cotizacion_inicial__contacto_cliente'
        ).prefetch_related(
            'proyectos__mis_literales',
            'proyectos__mis_literales__cotizaciones',
            'cotizaciones_adicionales',
            'cotizaciones_adicionales__contacto_cliente',
        ).annotate(
            fecha_oc=Min('pagos_proyectados__orden_compra_fecha'),
            valores_oc=Coalesce(Sum('pagos_proyectados__valor_orden_compra'), 0)
        )

    def lista_tuberia_ventas(self):
        return self.filter(role='E')


class CotizacionManagerDos(models.Manager):
    def get_queryset(self):
        return CotizacionQuerySet(self.model, using=self._db)

    def lista_cotizaciones(self):
        return self.get_queryset().list()

    def detalle_cotizacion(self):
        return self.get_queryset().detail()
