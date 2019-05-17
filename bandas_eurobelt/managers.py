from django.db import models
from django.db.models import Q, ExpressionWrapper, Sum, DecimalField, Subquery, OuterRef, F, IntegerField
from django.db.models.functions import Cast


# class ComponenteManager(models.Manager):
#     def get_queryset(self):
#         qs = super().get_queryset().annotate(
#             costo_cop=Cast(F('costo') * F('categoria__moneda__cambio'), IntegerField())
#         ).annotate(
#             costo_cop_fact_impor=Cast(F('costo_cop') * F('categoria__factor_importacion'), IntegerField()),
#             costo_cop_fact_impor_aereo=Cast(F('costo_cop') * F('categoria__factor_importacion_aereo'), IntegerField()),
#         ).annotate(
#             precio_base=Cast(
#                 F('costo_cop_fact_impor') / (1 - (F('categoria__margen_deseado') / 100)),
#                 IntegerField()
#             ),
#             precio_base_aereo=Cast(
#                 F('costo_cop_fact_impor_aereo') / (1 - (F('categoria__margen_deseado') / 100)),
#                 IntegerField()
#             ),
#         ).annotate(
#             rentabilidad=F('precio_base') - F('costo_cop_fact_impor')
#         ).all()
#         #print(qs.first().__dict__)
#         return qs
