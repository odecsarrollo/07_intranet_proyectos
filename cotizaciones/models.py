import datetime

import reversion
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from model_utils.models import TimeStampedModel

from clientes.models import ClienteBiable
from clientes.models import ContactoCliente
from cotizaciones.managers import CotizacionManagerDos


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
    base = CotizacionManagerDos()

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
    CHOICES_TIPO_ARCHIVO = (
        ('OTROS', 'Otros'),
        ('COTIZACION', 'Cotización'),
        ('ORDENCOMPRA', 'Orden de Compra'),
        ('CONTRATO', 'Contrato'),
        ('POLIZA', 'Póliza'),
    )

    def archivo_upload_to(instance, filename):
        nro_cotizacion = instance.cotizacion.id
        ahora = timezone.datetime.now()
        return "documentos/cotizaciones/%s/%s_%s%s%s%s_%s" % (
            nro_cotizacion, instance.tipo, ahora.year, ahora.month, ahora.day, ahora.microsecond, filename)

    nombre_archivo = models.CharField(max_length=300)
    archivo = models.FileField(null=True, upload_to=archivo_upload_to)
    cotizacion = models.ForeignKey(Cotizacion, related_name='mis_documentos', on_delete=models.PROTECT)
    orden_compra = models.OneToOneField(
        'CotizacionPagoProyectado',
        null=True,
        related_name='orden_compra_documento',
        on_delete=models.PROTECT
    )
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True)
    tipo = models.CharField(max_length=20, choices=CHOICES_TIPO_ARCHIVO, default='OTROS')

    class Meta:
        permissions = [
            ("list_archivocotizacion", "Can see list archivos cotizaciones"),
            ("delete_tipo_cotizacion_archivocotizacion", "Can delete archivos cotizaciones tipo cotización"),
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


# Realmente una orden de compra
class CotizacionPagoProyectado(TimeStampedModel):
    cotizacion = models.ForeignKey(Cotizacion, related_name='pagos_proyectados', on_delete=models.PROTECT)
    valor_orden_compra = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    orden_compra_nro = models.CharField(max_length=100, null=True)
    orden_compra_fecha = models.DateField(null=True)
    notificada_por_correo = models.BooleanField(default=False)
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='pagos_proyectados_creados')

    class Meta:
        permissions = [
            ("list_cotizacionpagoproyectado", "Can list pagos proyectados")
        ]


@reversion.register(fields=['fecha_proyectada', 'creado_por'])
class CotizacionPagoProyectadoAcuerdoPago(TimeStampedModel):
    orden_compra = models.ForeignKey(
        CotizacionPagoProyectado,
        on_delete=models.CASCADE,
        related_name='acuerdos_pagos'
    )
    motivo = models.CharField(max_length=100)
    porcentaje = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    requisitos = models.TextField(null=True)
    fecha_proyectada = models.DateField(null=True)
    valor_proyectado = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT)

    class Meta:
        permissions = [
            ("change_fecha_proyectada_cotizacionpagoproyectadoacuerdopago", "Can change fecha proyectada acuerdo pago"),
        ]


class CotizacionPagoProyectadoAcuerdoPagoPago(TimeStampedModel):
    def archivo_upload_to(instance, filename):
        nro_cotizacion = instance.acuerdo_pago.orden_compra.cotizacion.id
        ahora = timezone.datetime.now()
        extencion = filename.split('.')[-1]
        return "documentos/cotizaciones/%s/acuerdo_pago_%s%s%s_%s.%s" % (
            nro_cotizacion, ahora.year, ahora.month, ahora.day, ahora.microsecond, extencion)

    acuerdo_pago = models.ForeignKey(
        CotizacionPagoProyectadoAcuerdoPago,
        on_delete=models.CASCADE,
        related_name='pagos'
    )
    fecha = models.DateField(null=True)
    valor = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    comprobante_pago = models.FileField(null=True, upload_to=archivo_upload_to)
    notificada_por_correo = models.BooleanField(default=False)
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='cotizaciones_pagos_creados')

    class Meta:
        permissions = [
            ("list_cotizacionpagoproyectadoacuerdopagopago", "Can list acuerdos de pagos pagos"),
            ("delete_cotizacionpagoproyectadoacuerdopagopago_siempre", "Can delete acuerdos de pagos pagos siempre"),
        ]
