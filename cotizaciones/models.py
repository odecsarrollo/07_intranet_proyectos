import datetime

import reversion
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from model_utils.models import TimeStampedModel

from clientes.models import ClienteBiable, ContactoCliente
from cotizaciones.managers import CotizacionManager


@reversion.register()
class Cotizacion(TimeStampedModel):
    def archivo_upload_to(instance, filename):
        nro_cotizacion = instance.id
        return "documentos/cotizaciones/%s/%s" % (nro_cotizacion, filename)

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
    cliente = models.ForeignKey(
        ClienteBiable,
        on_delete=models.PROTECT,
        null=True,
        related_name='cotizaciones_proyectos'
    )
    descripcion_cotizacion = models.CharField(max_length=500)
    contacto_cliente = models.ForeignKey(
        ContactoCliente,
        related_name='cotizaciones_proyectos',
        on_delete=models.PROTECT
    )
    observacion = models.TextField(null=True, blank=True)
    valor_ofertado = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    valor_orden_compra = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    orden_compra_nro = models.CharField(max_length=100, null=True)
    orden_compra_fecha = models.DateField(null=True)
    orden_compra_archivo = models.FileField(null=True, upload_to=archivo_upload_to)
    fecha_entrega_pactada_cotizacion = models.DateField(null=True)
    dias_pactados_entrega_proyecto = models.IntegerField(null=True)
    costo_presupuestado = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    responsable = models.ForeignKey(User, on_delete=models.PROTECT, null=True)

    relacionada = models.BooleanField(default=False)
    revisada = models.BooleanField(default=False)
    listo_para_iniciar = models.BooleanField(default=False)
    estado = models.CharField(max_length=200, null=True, choices=ESTADOS_CHOICES)
    origen_cotizacion = models.CharField(max_length=100)
    estado_observacion_adicional = models.CharField(max_length=400, null=True)
    fecha_cambio_estado = models.DateField(null=True)
    fecha_cambio_estado_cerrado = models.DateField(null=True)
    fecha_limite_segumiento_estado = models.DateField(null=True)

    condiciones_inicio_fecha_ultima = models.DateField(null=True)
    condiciones_inicio_completas = models.BooleanField(default=False)

    objects = models.Manager()
    sumatorias = CotizacionManager()

    class Meta:
        permissions = [
            ['cotizacion_convertir_en_adicional', 'Puede convertir cotizacion en adicional'],
            ['list_cotizaciones_abrir_carpeta', 'Puede listar cotizaciones para abrir carpeta'],
            ['list_cotizaciones_notificaciones_consecutivo_proyectos',
             'Puede listar cotizaciones para notificaciones consecutivo proyectos'],
            ['eliminar_cotizacion_notificacion_consecutivo_proyectos',
             'Puede eliminar notificacion cotizaciones en consecutivo proyectos'],
            ['rel_cotizacion_adicional_a_literal', 'Puede relacionar cotizacion adicional a literal'],
            ['rel_cotizacion_proyecto', 'Puede relacionar cotizacion a proyecto'],
            ['list_cotizacion', 'Puede listar cotizaciones'],
            ['detail_cotizacion', 'Puede ver detalle cotizacion'],
            ['gestionar_cotizacion', 'Puede gestionar cotizacion'],
            ['list_all_cotizacion', 'Puede listar todas las cotizaciones'],
            ['list_all_cotizaciones_activas', 'Puede listar todas las cotizaciones activas'],
            ['list_tuberia_ventas', 'Puede ver la tuberia de bentas'],
            ['list_tuberia_informe_uno', 'Puede Ver informe de tuberia de ventas'],
            ['change_cerrada', 'Puede Editar Cotizacion Cerrada'],
        ]

    @property
    def fecha_entrega_pactada(self):
        if self.condiciones_inicio_fecha_ultima is not None and self.dias_pactados_entrega_proyecto is not None:
            fecha_entrega_proyecto = self.condiciones_inicio_fecha_ultima + datetime.timedelta(
                days=self.dias_pactados_entrega_proyecto)
            return fecha_entrega_proyecto
        return None

    @property
    def dias_para_vencer(self):
        if self.fecha_entrega_pactada:
            return (self.fecha_entrega_pactada - timezone.datetime.now().date()).days
        return None

    @property
    def abrir_carpeta(self) -> bool:
        return not self.revisada and not self.relacionada and self.estado == 'Cierre (Aprobado)' and self.cotizacion_inicial is None

    @property
    def notificar(self) -> bool:
        return not self.revisada and self.estado == 'Cierre (Aprobado)' and self.cotizacion_inicial is not None

    @property
    def es_adicional(self) -> bool:
        if self.cotizacion_inicial is not None:
            return True
        return False


class CotizacionOrdenCompra(TimeStampedModel):
    def archivo_upload_to(instance, filename):
        nro_cotizacion = instance.cotizacion.id
        return "documentos/cotizaciones/%s/ordenes_compra/%s" % (nro_cotizacion, filename)

    cotizacion = models.ForeignKey(Cotizacion, related_name='ordenes_compra', on_delete=models.PROTECT)
    valor_orden_compra = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    orden_compra_nro = models.CharField(max_length=100, null=True)
    orden_compra_fecha = models.DateField(null=True)
    orden_compra_archivo = models.FileField(null=True, upload_to=archivo_upload_to)


class CotizacionOrdenCompraPlanPago(TimeStampedModel):
    orden_compra = models.ForeignKey(
        CotizacionOrdenCompra,
        on_delete=models.CASCADE,
        related_name='planes_pagos'
    )
    fecha = models.DateField()
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    valor = models.DecimalField(max_digits=20, decimal_places=2, default=0)


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


class CondicionInicioProyecto(models.Model):
    descripcion = models.CharField(max_length=400)
    require_documento = models.BooleanField(default=False)
    condicion_especial = models.BooleanField(default=False)  # Casos especiales donde inician solo con esta opción

    class Meta:
        permissions = [
            ("list_condicioninicioproyecto", "Can list condiciones inicio cotizaciones"),
        ]


class CondicionInicioProyectoCotizacion(models.Model):
    def archivo_upload_to(instance, filename):
        nro_cotizacion = instance.cotizacion_proyecto.id
        return "documentos/cotizaciones/%s/%s" % (nro_cotizacion, filename)

    cotizacion_proyecto = models.ForeignKey(
        Cotizacion,
        on_delete=models.PROTECT,
        related_name='condiciones_inicio_cotizacion'
    )
    condicion_inicio_proyecto = models.ForeignKey(
        CondicionInicioProyecto,
        on_delete=models.PROTECT,
        related_name='condiciones_inicio_cotizacion'
    )
    descripcion = models.CharField(max_length=400)
    require_documento = models.BooleanField(default=False)
    condicion_especial = models.BooleanField(default=False)
    fecha_entrega = models.DateField(null=True, blank=True)
    documento = models.FileField(null=True, upload_to=archivo_upload_to)

    @property
    def cumple_condicion(self):
        if self.fecha_entrega:
            if self.require_documento and self.documento is not None:
                return True
            elif not self.require_documento:
                return True
            return False
        return False
