from django.db import models
from django.db.models import Sum, F, ExpressionWrapper, DecimalField, OuterRef, Subquery
from django.db.models.functions import Coalesce

from cotizaciones.models import Cotizacion


class ProyectoQuerySet(models.QuerySet):
    def create_queryset(self, tipo):
        qs = self.select_related('cliente').prefetch_related(
            'cotizaciones',
            'mis_literales',
            'mis_documentos__creado_por',
            'mis_literales__facturas',
            'mis_literales__mis_documentos__creado_por',
            'mis_literales__materiales__item',
            'mis_literales__materiales__item__unidad_medida_en_inventario',
        )
        if tipo in [0, 1]:
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
            ).distinct()

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
            ).distinct()

            qs = qs.prefetch_related(
                'mis_literales__mis_horas_trabajadas__hoja__tasa',
                'mis_literales__mis_horas_trabajadas__hoja__colaborador',
                'mis_literales__mis_horas_trabajadas__hoja__tasa__centro_costo',
                'mis_literales__mis_horas_trabajadas_iniciales__colaborador',
                'mis_literales__mis_horas_trabajadas_iniciales__centro_costo'
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
                )
            ).all()

        if tipo in [0, 2]:
            _cotizaciones = Cotizacion.objects.values('proyectos__id_proyecto').annotate(
                costo_presupuestado=Coalesce(Sum('costo_presupuestado'), 0),
                valores_oc=Coalesce(Sum('pagos_proyectados__valor_orden_compra'), 0),
            ).filter(
                proyectos__id_proyecto=OuterRef('id_proyecto'),
                estado='Cierre (Aprobado)'
            ).distinct()

            _cotizaciones_adicionales = Cotizacion.objects.values(
                'cotizacion_inicial__proyectos__id_proyecto').annotate(
                costo_presupuestado=Sum('costo_presupuestado'),
                valores_oc=Coalesce(Sum('pagos_proyectados__valor_orden_compra'), 0),
            ).filter(
                cotizacion_inicial__proyectos__id_proyecto=OuterRef('id_proyecto'),
                estado='Cierre (Aprobado)'
            ).distinct()

            qs = qs.annotate(
                costo_presupuestado_cotizaciones=Coalesce(
                    Subquery(_cotizaciones.values('costo_presupuestado')), 0
                ),
                valor_orden_compra_cotizaciones=Coalesce(
                    Subquery(_cotizaciones.values('valores_oc')), 0
                ),
                costo_presupuestado_cotizaciones_adicional=Coalesce(
                    Subquery(_cotizaciones_adicionales.values('costo_presupuestado')), 0
                ),
                valor_orden_compra_cotizaciones_adicional=Coalesce(
                    Subquery(_cotizaciones_adicionales.values('valores_oc')), 0),
            ).all()
        return qs

    def mano_obra(self):
        return self.create_queryset(1)

    def cotizaciones(self):
        return self.create_queryset(2)

    def todo(self):
        return self.create_queryset(0)


class ProyectoManager(models.Manager):
    def get_queryset(self):
        return ProyectoQuerySet(self.model, using=self._db)

    def mano_obra(self):
        return self.get_queryset().mano_obra()

    def todo(self):
        return self.get_queryset().todo()
