from django.db import models
from django.contrib.auth.models import User
from model_utils.models import TimeStampedModel

from clientes.models import ClienteBiable


class Cotizacion(TimeStampedModel):
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, related_name='cotizaciones_creadas')
    nro_cotizacion = models.PositiveIntegerField(null=True, blank=True, unique=True)
    unidad_negocio = models.CharField(max_length=10)
    cliente = models.ForeignKey(ClienteBiable, on_delete=models.PROTECT, null=True, blank=True)
    descripcion_cotizacion = models.CharField(max_length=500)
    contacto = models.CharField(max_length=400)
    estado = models.CharField(max_length=200, null=True, blank=True)
    observacion = models.TextField(null=True, blank=True)
    valor_ofertado = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    valor_orden_compra = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    orden_compra_nro = models.CharField(max_length=20, null=True, blank=True)
    orden_compra_fecha = models.DateField(null=True, blank=True)
    fecha_entrega_pactada_cotizacion = models.DateField(null=True, blank=True)
    fecha_entrega_pactada = models.DateField(null=True, blank=True)
    costo_presupuestado = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    responsable = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)
    abrir_carpeta = models.BooleanField(default=False)
    crear_literal = models.BooleanField(default=False)
    crear_literal_id_proyecto = models.CharField(max_length=10, null=True, blank=True)

    class Meta:
        permissions = [
            ['list_cotizacion', 'Puede listar cotizaciones'],
            ['detail_cotizacion', 'Puede ver detalle cotizacion'],
            ['gestionar_cotizacion', 'Puede gestionar cotizacion'],
            ['list_all_cotizacion', 'Puede listar todas las cotizaciones'],
        ]


class SeguimientoCotizacion(TimeStampedModel):
    TIPO_SEGUIMIENTO_CHOICE = (
        (0, 'Comentario'),
        (1, 'Cambio de Estado'),
        (2, 'Tarea'),
    )
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT)
    cotizacion = models.ForeignKey(Cotizacion, on_delete=models.CASCADE, related_name='mis_seguimientos')
    tipo_seguimiento = models.PositiveIntegerField(choices=TIPO_SEGUIMIENTO_CHOICE)
    observacion = models.TextField(null=True, blank=True)
    estado = models.CharField(max_length=200, null=True, blank=True)
    nombre_tarea = models.CharField(max_length=200, null=True, blank=True)
    fecha_inicio_tarea = models.DateField(null=True, blank=True)
    fecha_fin_tarea = models.DateField(null=True, blank=True)
    tarea_terminada = models.BooleanField(default=0)
