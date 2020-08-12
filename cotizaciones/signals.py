from django.db.models.signals import post_init
from django.db.models.signals import post_save
from django.db.models.signals import pre_delete
from django.dispatch import receiver

from .models import ArchivoCotizacion
from .models import CondicionInicioProyectoCotizacion
from .models import Cotizacion
from .models import CotizacionPagoProyectado
from .models import CotizacionPagoProyectadoAcuerdoPagoPago


# region Cotización Documento Oferta
@receiver(pre_delete, sender=Cotizacion)
def cotizacion_archivo_pre_delete(sender, instance, **kwargs):
    instance.cotizacion_archivo.delete(False)


@receiver(post_init, sender=Cotizacion)
def backup_cotizacion_archivo_path(sender, instance, **kwargs):
    instance._current_cotizacion_archivo = instance.cotizacion_archivo


@receiver(post_save, sender=Cotizacion)
def delete_cotizacion_archivo(sender, instance, **kwargs):
    if hasattr(instance, '_current_cotizacion_archivo'):
        if instance._current_cotizacion_archivo != instance.cotizacion_archivo:
            instance._current_cotizacion_archivo.delete(save=False)


# endregion

# region Archivo Cotización
@receiver(pre_delete, sender=ArchivoCotizacion)
def archivo_pre_delete(sender, instance, **kwargs):
    instance.archivo.delete(False)


@receiver(post_init, sender=ArchivoCotizacion)
def backup_archivo_path(sender, instance, **kwargs):
    instance._current_archivo = instance.archivo


@receiver(post_save, sender=ArchivoCotizacion)
def delete_archivo(sender, instance, **kwargs):
    if hasattr(instance, '_current_archivo'):
        if instance._current_archivo != instance.archivo:
            instance._current_archivo.delete(save=False)


# endregion

# region Documento Condicion Inicio
@receiver(pre_delete, sender=CondicionInicioProyectoCotizacion)
def documento_condicion_inicio_pre_delete(sender, instance, **kwargs):
    instance.documento.delete(False)


@receiver(post_init, sender=CondicionInicioProyectoCotizacion)
def backup_documento_condicion_inicio_path(sender, instance, **kwargs):
    instance._current_documento = instance.documento


@receiver(post_save, sender=CondicionInicioProyectoCotizacion)
def delete_documento_condicion_inicio(sender, instance, **kwargs):
    if hasattr(instance, '_current_documento'):
        if instance._current_documento != instance.documento:
            instance._current_documento.delete(save=False)


# endregion

# region Archivo Orden Compra Viejo
@receiver(pre_delete, sender=Cotizacion)
def orden_compra_archivo_cotizacion_v_pre_delete(sender, instance, **kwargs):
    instance.orden_compra_archivo.delete(False)


@receiver(post_init, sender=Cotizacion)
def backup_orden_compra_archivo_cotizacion_v_path(sender, instance, **kwargs):
    instance._current_documento = instance.orden_compra_archivo


@receiver(post_save, sender=Cotizacion)
def delete_orden_compra_archivo_cotizacion_v(sender, instance, **kwargs):
    if hasattr(instance, '_current_orden_compra_archivo'):
        if instance._current_orden_compra_archivo != instance.orden_compra_archivo:
            instance._current_orden_compra_archivo.delete(save=False)


# endregion

# region Eliminación Archivo de Orden Compra
@receiver(pre_delete, sender=CotizacionPagoProyectado)
def orden_compra_archivo_cotizacion_pre_delete(sender, instance, **kwargs):
    instance.orden_compra_archivo.delete(False)


@receiver(post_init, sender=CotizacionPagoProyectado)
def backup_orden_compra_archivo_cotizacion_path(sender, instance, **kwargs):
    instance._current_orden_compra_archivo = instance.orden_compra_archivo


@receiver(post_save, sender=CotizacionPagoProyectado)
def delete_current_orden_compra_archivo_cotizacion(sender, instance, **kwargs):
    if hasattr(instance, '_current_orden_compra_archivo'):
        if instance._current_orden_compra_archivo != instance.orden_compra_archivo:
            instance._current_orden_compra_archivo.delete(save=False)


# endregion

# region Eliminación de Archivo Pago
@receiver(pre_delete, sender=CotizacionPagoProyectadoAcuerdoPagoPago)
def comprobante_pago_cotizacion_pre_delete(sender, instance, **kwargs):
    instance.comprobante_pago.delete(False)


@receiver(post_init, sender=CotizacionPagoProyectadoAcuerdoPagoPago)
def backup_comprobante_pago_cotizacion_path(sender, instance, **kwargs):
    instance._current_comprobante_pago = instance.comprobante_pago


@receiver(post_save, sender=CotizacionPagoProyectadoAcuerdoPagoPago)
def delete_comprobante_pago_cotizacion(sender, instance, **kwargs):
    if hasattr(instance, '_current_comprobante_pago'):
        if instance._current_comprobante_pago != instance.comprobante_pago:
            instance._current_comprobante_pago.delete(save=False)
# endregion
