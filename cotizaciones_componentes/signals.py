from django.db.models.signals import pre_delete, post_init, post_save
from django.dispatch import receiver

from .models import CotizacionComponenteAdjunto


@receiver(pre_delete, sender=CotizacionComponenteAdjunto)
def cotizacion_componente_adjunto_pre_delete(sender, instance, **kwargs):
    if instance.adjunto:
        instance.adjunto.delete(False)
    if instance.imagen:
        instance.imagen.delete(False)


@receiver(post_init, sender=CotizacionComponenteAdjunto)
def backup_cotizacion_componente_adjunto_path(sender, instance, **kwargs):
    if instance.adjunto:
        instance._current_adjunto = instance.adjunto
    if instance.imagen:
        instance._current_imagen = instance.imagen


@receiver(post_save, sender=CotizacionComponenteAdjunto)
def delete_cotizacion_componente_adjunto_(sender, instance, **kwargs):
    if hasattr(instance, '_current_adjunto'):
        if instance._current_adjunto != instance.adjunto:
            instance._current_adjunto.delete(save=False)
    if hasattr(instance, '_current_imagen'):
        if instance._current_imagen != instance.imagen:
            instance._current_imagen.delete(save=False)
