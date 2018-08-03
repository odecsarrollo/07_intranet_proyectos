from django.db import models
from model_utils.models import TimeStampedModel
from registration.forms import User

from proyectos.models import Literal

from cguno.models import ItemsBiable


class ItemLiteralDiseno(TimeStampedModel):
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='items_listados_materiales_subidos',
                                   null=True, blank=True)
    literal = models.ForeignKey(Literal, on_delete=models.PROTECT, related_name='items_listado_materiales')
    codigo = models.CharField(max_length=200)
    item_cguno = models.ForeignKey(
        ItemsBiable,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='items_listado_materiales'
    )
    item_cguno_temporal = models.PositiveIntegerField(null=True)
    descripcion = models.CharField(max_length=200)
    material = models.CharField(max_length=200)
    cantidad_material = models.CharField(max_length=200, null=True, blank=True)
    proceso = models.CharField(max_length=200, null=True, blank=True)
    acabado = models.CharField(max_length=200, null=True, blank=True)
    prioridad = models.PositiveIntegerField(null=True, blank=True)
    eliminado = models.BooleanField(default=False)
    cambio_cantidad = models.IntegerField(default=0)
    registro_anterior = models.OneToOneField('self', on_delete=models.PROTECT, related_name='registro_actual',
                                             null=True)
    fecha_requerido = models.DateTimeField(null=True)


class CantidadItemLiteralDiseno(TimeStampedModel):
    item_literal_diseno = models.ForeignKey(ItemLiteralDiseno, on_delete=models.PROTECT, related_name='cantidades')
    creado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='cantidades_items_listados_materiales_subidos',
        null=True,
        blank=True
    )
    cantidad = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
    cantidad_a_comprar = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
    cantidad_reservada_inventario = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
