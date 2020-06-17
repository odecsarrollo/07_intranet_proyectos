from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from model_utils.models import TimeStampedModel

from clientes.models import ContactoCliente, ClienteBiable
from cotizaciones_componentes.managers import CotizacionComponenteManager
from geografia.models import Ciudad
from cargues_detalles.models import FacturaDetalle
from listas_precios.models import FormaPagoCanal
from bandas_eurobelt.models import BandaEurobelt, ComponenteBandaEurobelt
from catalogo_productos.models import ItemVentaCatalogo
from imagekit.models import ProcessedImageField, ImageSpecField
from imagekit.processors import ResizeToFit, ResizeToFill


class CotizacionComponente(TimeStampedModel):
    ESTADOS = (
        ('INI', 'Edición'),
        ('ENV', 'Enviada'),
        ('REC', 'Recibida'),
        ('PRO', 'En Proceso'),
        ('FIN', 'Entragada Totalmente'),
        ('ELI', 'Rechazada'),
        ('APL', 'Aplazada'),
    )
    responsable = models.ForeignKey(
        User,
        related_name='cotizaciones_componentes',
        on_delete=models.PROTECT,
        null=True
    )
    creado_por = models.ForeignKey(
        User,
        related_name='cotizaciones_componentes_creadas',
        on_delete=models.PROTECT,
        null=True
    )
    moneda = models.CharField(max_length=3, default='COP')
    nro_consecutivo = models.PositiveIntegerField(null=True)
    cliente = models.ForeignKey(ClienteBiable, related_name='cotizaciones_componentes', on_delete=models.PROTECT)
    contacto = models.ForeignKey(ContactoCliente, related_name='cotizaciones_componentes', on_delete=models.PROTECT)
    ciudad = models.ForeignKey(Ciudad, related_name='cotizaciones_componentes', on_delete=models.PROTECT)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='INI')
    observaciones = models.TextField(null=True)
    razon_rechazo = models.TextField(null=True)
    es_crm_anterior = models.BooleanField(default=False)

    fecha_verificacion_cambio_estado = models.DateField(null=True, db_column='fec_ver_cam_est')
    fecha_verificacion_proximo_seguimiento = models.DateField(null=True, db_column='fec_ver_pro_seg')

    objects = CotizacionComponenteManager()
    facturas = models.ManyToManyField(FacturaDetalle, related_name='cotizaciones_componentes')

    orden_compra_nro = models.CharField(max_length=120, null=True)
    orden_compra_fecha = models.DateField(max_length=120, null=True)
    orden_compra_valor = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    @property
    def pdf(self) -> 'CotizacionComponenteDocumento':
        return self.versiones.last()

    @property
    def color_seguimiento(self):
        fecha_ini = self.fecha_verificacion_cambio_estado
        fecha_seg = self.fecha_verificacion_proximo_seguimiento
        fecha_act = timezone.datetime.now().date()
        if self.estado in ['INI', 'ELI']:
            return None
        if fecha_ini and fecha_seg:
            delta = (fecha_act - fecha_ini).days
            dias = (fecha_seg - fecha_ini).days
            if dias == 0:
                porcentaje = 1
            else:
                porcentaje = delta / dias
            if porcentaje >= 0.9:
                return 'tomato'
            elif porcentaje > 0.66:
                return 'yellow'
            else:
                return 'lightgreen'
        if not self.fecha_verificacion_cambio_estado:
            return None

    @property
    def porcentaje_seguimineto(self):
        fecha_ini = self.fecha_verificacion_cambio_estado
        fecha_seg = self.fecha_verificacion_proximo_seguimiento
        if self.estado in ['INI', 'ELI']:
            return None
        if fecha_ini and fecha_seg:
            fecha_act = timezone.datetime.now().date()
            delta = (fecha_act - fecha_ini).days
            dias = (fecha_seg - fecha_ini).days
            if dias == 0:
                porcentaje = 1
            else:
                porcentaje = delta / dias
            return round(porcentaje * 100, 2)
        else:
            return None

    class Meta:
        permissions = [
            ("list_cotizacioncomponente", "Can list cotizaciones componentes"),
            ("list_todos_vendedores_cotizacioncomponente", "Can list cotizaciones componentes otros vendedores"),
        ]


class CotizacionComponenteDocumento(TimeStampedModel):
    def archivo_upload_to(instance, filename):
        return "cotizaciones/ventas_componentes/%s/%s" % (instance.cotizacion_componente.id, filename)

    cotizacion_componente = models.ForeignKey(CotizacionComponente, on_delete=models.PROTECT, related_name='versiones')
    creado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='cotizaciones_componentes_documentos_creados'
    )
    version = models.PositiveIntegerField()
    pdf_cotizacion = models.FileField(upload_to=archivo_upload_to)


class CotizacionComponenteAdjunto(TimeStampedModel):
    def archivo_upload_to(instance, filename):
        extencion = filename.split('.')[-1]
        return "cotizaciones/ventas_componentes/%s/%s.%s" % (
            instance.cotizacion_componente.id, instance.nombre_adjunto, extencion)

    nombre_adjunto = models.CharField(max_length=300)
    cotizacion_componente = models.ForeignKey(
        CotizacionComponente,
        on_delete=models.PROTECT,
        related_name='adjuntos'
    )
    adjunto = models.FileField(upload_to=archivo_upload_to, null=True)
    imagen = ProcessedImageField(
        processors=[ResizeToFit(1080, 720)],
        format='JPEG',
        options={'quality': 70},
        null=True,
        upload_to=archivo_upload_to
    )
    imagen_thumbnail = ImageSpecField(
        source='imagen',
        processors=[ResizeToFill(100, 100)],
        format='JPEG',
        options={'quality': 60}
    )
    creado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='cotizaciones_componentes_imagenes_adjuntadas'
    )


class ItemCotizacionComponente(TimeStampedModel):
    posicion = models.PositiveIntegerField()
    cotizacion = models.ForeignKey(CotizacionComponente, related_name="items", on_delete=models.PROTECT)
    componente_eurobelt = models.ForeignKey(
        ComponenteBandaEurobelt,
        related_name="items_cotizaciones_componentes",
        null=True,
        on_delete=models.PROTECT
    )
    banda_eurobelt = models.ForeignKey(
        BandaEurobelt,
        related_name="items_cotizaciones_componentes",
        null=True,
        on_delete=models.PROTECT
    )
    articulo_catalogo = models.ForeignKey(
        ItemVentaCatalogo,
        related_name="items_cotizaciones_componentes",
        null=True,
        on_delete=models.PROTECT
    )
    forma_pago = models.ForeignKey(
        FormaPagoCanal,
        related_name="items_cotizaciones_componentes",
        null=True,
        on_delete=models.PROTECT
    )

    dias_entrega = models.PositiveIntegerField(default=0)
    moneda_origen = models.CharField(max_length=20, null=True)
    moneda_origen_costo = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    tasa_cambio_a_dolares = models.DecimalField(max_digits=18, decimal_places=7, default=0)
    tasa_cambio_a_pesos = models.DecimalField(max_digits=18, decimal_places=7, default=0)
    descripcion_ori = models.CharField(max_length=400, null=True)
    referencia_ori = models.CharField(max_length=150, null=True)
    unidad_medida_ori = models.CharField(max_length=120, null=True)
    precio_unitario_ori = models.DecimalField(max_digits=18, decimal_places=2, default=-1)
    costo_ori = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    verificar_personalizacion = models.BooleanField(default=0)
    verificada_personalizacion = models.BooleanField(default=0)
    verifico_usuario = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        related_name='cotizacion_componentes_items_verificados'
    )
    verifico_fecha = models.DateTimeField(null=True)

    descripcion = models.CharField(max_length=400, null=True)
    referencia = models.CharField(max_length=150, null=True)
    unidad_medida = models.CharField(max_length=120, null=True)
    cantidad = models.DecimalField(max_digits=18, decimal_places=3)
    precio_unitario = models.DecimalField(max_digits=18, decimal_places=2)
    valor_total = models.DecimalField(max_digits=18, decimal_places=2)
    transporte_tipo = models.CharField(null=True, max_length=100)

    verificacion_solicitada = models.BooleanField(default=0)
    verificacion_solicitada_fecha = models.DateTimeField(null=True)
    verificacion_solicitada_usuario = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        null=True,
        related_name='cotizacion_componentes_items_verificaciones_solicitadas'
    )

    class Meta:
        permissions = [
            ("list_itemcotizacioncomponente", "Can list items cotizaciones componentes")
        ]

    @property
    def tiempo_entrega(self):
        dias = self.dias_entrega
        if dias == 0:
            return 'Inmediato'
        elif dias == 1:
            return '1 día'
        return '%s días' % dias


class CotizacionComponenteSeguimiento(TimeStampedModel):
    TIPOS = (
        ('TEL', 'Llamada'),
        ('VIS', 'Visíta'),
        ('COM', 'Comentario'),
        ('EST', 'Cambio Estado'),
        ('ENV', 'Envio Correo'),
        ('SEG', 'Seguimiento'),
    )
    cotizacion_componente = models.ForeignKey(
        CotizacionComponente,
        on_delete=models.PROTECT,
        related_name='seguimientos'
    )
    tipo_seguimiento = models.CharField(
        max_length=3,
        choices=TIPOS
    )
    documento_cotizacion = models.ForeignKey(
        CotizacionComponenteDocumento,
        null=True,
        related_name='seguimientos',
        on_delete=models.PROTECT
    )
    descripcion = models.TextField()
    estado_anterior = models.CharField(max_length=3, null=True, blank=True)
    fecha = models.DateTimeField()
    creado_por = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='cotizaciones_componentes_seguimientos'
    )
