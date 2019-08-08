from django.contrib.auth.models import User
from django.db import models
#
# # Create your models here.
# from model_utils.models import TimeStampedModel
#
#
# class CotizacionComponente(TimeStampedModel):
#     ESTADOS = (
#         ('INI', 'Iniciado'),
#         ('ENV', 'Enviada'),
#         ('ELI', 'Rechazada'),
#         ('REC', 'Recibida'),
#         ('PRO', 'En Proceso'),
#         ('FIN', 'Entragada Totalmente'),
#     )
#     estado = models.CharField(max_length=10, choices=ESTADOS, default='INI')
#     nro_contacto = models.CharField(null=True, blank=True, max_length=30)  # validators should be a list
#     email = models.EmailField(max_length=150)
#     nombres_contacto = models.CharField(max_length=120)
#     pais = models.CharField(max_length=120, blank=True, null=True)
#     ciudad = models.CharField(max_length=120, blank=True, null=True)
#     apellidos_contacto = models.CharField(max_length=120)
#     razon_social = models.CharField(max_length=120, blank=True, null=True)
#     nro_cotizacion = models.CharField(max_length=120)
#     fecha_envio = models.DateTimeField(null=True, blank=True)
#     total = models.DecimalField(max_digits=18, decimal_places=0, default=0)
#     total_venta_perdida = models.DecimalField(max_digits=18, decimal_places=2, default=0)
#     descuento = models.DecimalField(max_digits=18, decimal_places=2, default=0)
#     usuario = models.ForeignKey(User, related_name='cotizaciones', on_delete=models.PROTECT)
#     creado_por = models.ForeignKey(User, related_name='cotizaciones_creadas', editable=False)
#     observaciones = models.TextField(max_length=300, blank=True, null=True)
#     en_edicion = models.BooleanField(default=False)
#     version = models.PositiveIntegerField(default=1)
#     ciudad_despacho = models.ForeignKey(Ciudad, null=True, blank=True)
#     cliente = models.ForeignKey(Cliente, null=True, blank=True, related_name='mis_cotizaciones')
#     cliente_nuevo = models.BooleanField(default=False)
#     otra_ciudad = models.BooleanField(default=False)
#     sucursal_sub_empresa = models.CharField(max_length=120, blank=True, null=True, verbose_name='Empresa o Sucursal')
#     actualmente_cotizador = models.BooleanField(default=False, editable=False)
#     contacto = models.ForeignKey(ContactoEmpresa, null=True, blank=True, related_name='mis_cotizaciones')
#     contacto_nuevo = models.BooleanField(default=False)
