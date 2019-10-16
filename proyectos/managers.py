from django.db import models
from django.db.models import Sum, F, ExpressionWrapper, DecimalField, OuterRef, Subquery
from django.db.models.functions import Coalesce

from cotizaciones.models import Cotizacion


class ProyectoManager(models.Manager):
    def get_queryset(self):
        from mano_obra.models import HoraHojaTrabajo, HoraTrabajoColaboradorLiteralInicial
        mano_obra = HoraHojaTrabajo.objects.values('literal__proyecto__id_proyecto').annotate(
            cantidad_horas=ExpressionWrapper(Sum((F('cantidad_minutos') / 60)),
                                             output_field=DecimalField(max_digits=4)),
            costo_total=ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60) * (
                        (F('hoja__tasa__costo') + F('hoja__tasa__otro_costo')) / F(
                    'hoja__tasa__nro_horas_mes_trabajadas'))),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal__proyecto__id_proyecto=OuterRef('id_proyecto'),
            verificado=True
        )

        mano_obra_inicial = HoraTrabajoColaboradorLiteralInicial.objects.values(
            'literal__proyecto__id_proyecto').annotate(
            cantidad_horas=
            ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60)),
                output_field=DecimalField(max_digits=4)
            ),
            costo_total=
            ExpressionWrapper(
                Sum('valor'),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal__proyecto__id_proyecto=OuterRef('id_proyecto')
        )

        cotizaciones = Cotizacion.objects.values('proyectos__id_proyecto').annotate(
            costo_presupuestado_cotizaciones=ExpressionWrapper(
                Sum('costo_presupuestado'),
                output_field=DecimalField(max_digits=4)
            ),
            valor_orden_compra_cotizaciones=ExpressionWrapper(
                Sum('valor_orden_compra'),
                output_field=DecimalField(max_digits=4)
            )
        ).filter(
            proyectos__id_proyecto=OuterRef('id_proyecto'),
            estado='Cierre (Aprobado)'
        ).distinct()

        cotizaciones_adicionales = Cotizacion.objects.values('cotizacion_inicial__proyectos__id_proyecto').annotate(
            costo_presupuestado_cotizaciones=ExpressionWrapper(
                Sum('costo_presupuestado'),
                output_field=DecimalField(max_digits=4)
            ),
            valor_orden_compra_cotizaciones=ExpressionWrapper(
                Sum('valor_orden_compra'),
                output_field=DecimalField(max_digits=4)
            )
        ).filter(
            cotizacion_inicial__proyectos__id_proyecto=OuterRef('id_proyecto'),
            estado='Cierre (Aprobado)'
        ).distinct()

        qs = super().get_queryset().select_related(
            'cliente',
        ).prefetch_related(
            'mis_literales',
            'mis_documentos',
            'mis_documentos__creado_por',
            'mis_literales__mis_documentos',
            'mis_literales__mis_documentos__creado_por',
            'mis_literales__mis_horas_trabajadas',
            'mis_literales__mis_horas_trabajadas__hoja',
            'mis_literales__mis_horas_trabajadas__hoja__tasa',
            'mis_literales__mis_horas_trabajadas__hoja__colaborador',
            'mis_literales__mis_horas_trabajadas__hoja__tasa__centro_costo',
            'mis_literales__mis_horas_trabajadas_iniciales',
            'mis_literales__mis_horas_trabajadas_iniciales__colaborador',
            'mis_literales__mis_horas_trabajadas_iniciales__centro_costo',
            'mis_literales__mis_materiales',
            'mis_literales__mis_materiales__item_biable',
        ).annotate(
            costo_mano_obra=Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra.values('costo_total')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            costo_mano_obra_inicial=Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra_inicial.values('costo_total')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            cantidad_horas_mano_obra=Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra.values('cantidad_horas')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            cantidad_horas_mano_obra_inicial=Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra_inicial.values('cantidad_horas')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            costo_presupuestado_cotizaciones=Coalesce(
                ExpressionWrapper(
                    Subquery(cotizaciones.values('costo_presupuestado_cotizaciones')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            valor_orden_compra_cotizaciones=Coalesce(
                ExpressionWrapper(
                    Subquery(cotizaciones.values('valor_orden_compra_cotizaciones')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            costo_presupuestado_cotizaciones_adicional=Coalesce(
                ExpressionWrapper(
                    Subquery(cotizaciones_adicionales.values('costo_presupuestado_cotizaciones')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
            valor_orden_compra_cotizaciones_adicional=Coalesce(
                ExpressionWrapper(
                    Subquery(cotizaciones_adicionales.values('valor_orden_compra_cotizaciones')),
                    output_field=DecimalField(max_digits=4)
                ), 0
            ),
        ).all()
        return qs
