import reversion
from django.db import models
from django.contrib.auth.models import User
from model_utils.models import TimeStampedModel

from clientes.models import ClienteBiable, ContactoCliente
from cotizaciones.managers import CotizacionManager


@reversion.register()
class Cotizacion(TimeStampedModel):
    ESTADOS_CHOICES = (
        ('Cita/Generación Interés', 'Cita/Generación Interés'),
        ('Configurando Propuesta', 'Configurando Propuesta'),
        ('Cotización Enviada', 'Cotización Enviada'),
        ('Evaluación Técnica y Económica', 'Evaluación Técnica y Económica'),
        ('Aceptación de Terminos y Condiciones', 'Aceptación de Terminos y Condiciones'),
        ('Cierre (Aprobado)', 'Cierre (Aprobado)'),
        ('Aplazado', 'Aplazado'),
        ('Cancelado', 'Cancelado'),
    )
    UNIDADES_NEGOCIOS_CHOICES = (
        ('TRP', 'TRP - TRANSPORTADOR'),
        ('EQR', 'EQR - EQUIPOS REPRESENTADOS'),
        ('SER', 'SER - SERVICIOS'),
        ('EQO', 'EQO - EQUIPO ODECOPACK'),
        ('SOL', 'SOL - SOLUCIONES'),
        ('ADI', 'ADI - ADICIONAL'),
    )
    created_by = models.ForeignKey(
        User, on_delete=models.PROTECT,
        null=True,
        related_name='cotizaciones_creadas'
    )
    nro_cotizacion = models.PositiveIntegerField(null=True, unique=True)
    unidad_negocio = models.CharField(max_length=10)
    cotizacion_inicial = models.ForeignKey(
        'self',
        null=True,
        on_delete=models.PROTECT,
        related_name='cotizaciones_adicionales'
    )
    cliente = models.ForeignKey(ClienteBiable, on_delete=models.PROTECT, null=True)
    descripcion_cotizacion = models.CharField(max_length=500)
    contacto_cliente = models.ForeignKey(
        ContactoCliente,
        null=True,
        related_name='mis_contizaciones',
        on_delete=models.PROTECT
    )
    contacto = models.CharField(max_length=400, null=True)
    observacion = models.TextField(null=True)
    valor_ofertado = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    valor_orden_compra = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    orden_compra_nro = models.CharField(max_length=100, null=True)
    orden_compra_fecha = models.DateField(null=True)
    fecha_entrega_pactada_cotizacion = models.DateField(null=True)
    fecha_entrega_pactada = models.DateField(null=True)
    costo_presupuestado = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    responsable = models.ForeignKey(User, on_delete=models.PROTECT, null=True)

    relacionada = models.BooleanField(default=False)
    revisada = models.BooleanField(default=False)
    estado = models.CharField(max_length=200, null=True, choices=ESTADOS_CHOICES)
    origen_cotizacion = models.CharField(max_length=100, null=True)
    estado_observacion_adicional = models.CharField(max_length=400, null=True)
    fecha_cambio_estado = models.DateField(null=True)
    fecha_cambio_estado_cerrado = models.DateField(null=True)
    fecha_limite_segumiento_estado = models.DateField(null=True)

    objects = models.Manager()
    sumatorias = CotizacionManager()

    class Meta:
        permissions = [
            ['list_cotizacion', 'Puede listar cotizaciones'],
            ['detail_cotizacion', 'Puede ver detalle cotizacion'],
            ['gestionar_cotizacion', 'Puede gestionar cotizacion'],
            ['list_all_cotizacion', 'Puede listar todas las cotizaciones'],
            ['list_all_cotizaciones_activas', 'Puede listar todas las cotizaciones activas'],
            ['list_tuberia_ventas', 'Puede ver la tuberia de bentas'],
            ['list_tuberia_informe_uno', 'Puede Ver informe de tuberia de ventas'],
        ]

    @property
    def abrir_carpeta(self) -> bool:
        return not self.relacionada and self.orden_compra_nro is not None and self.estado == 'Cierre (Aprobado)' and self.cotizacion_inicial is None

    @property
    def revisar(self) -> bool:
        if not self.revisada and self.cotizacion_inicial is not None:
            return True
        return False

    @property
    def cliente_cotizacion(self) -> ClienteBiable:
        if self.cotizacion_inicial is None:
            return self.cliente
        return self.cotizacion_inicial.cliente_cotizacion

    @property
    def contacto_cotizacion(self) -> ContactoCliente:
        if self.cotizacion_inicial is None:
            return self.contacto_cliente
        return self.cotizacion_inicial.contacto_cotizacion

    @property
    def es_adicional(self) -> bool:
        if self.cotizacion_inicial is not None:
            return True
        return False


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


class ArchivoCotizacion(TimeStampedModel):
    def archivo_upload_to(instance, filename):
        nro_cotizacion = instance.cotizacion.id
        return "documentos/cotizaciones/%s/%s" % (nro_cotizacion, filename)

    nombre_archivo = models.CharField(max_length=300)
    archivo = models.FileField(null=True, upload_to=archivo_upload_to)
    cotizacion = models.ForeignKey(Cotizacion, related_name='mis_documentos', on_delete=models.PROTECT)
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True)

    class Meta:
        permissions = [
            ("list_archivocotizacion", "Can see list archivos cotizaciones"),
        ]
