from django.db.models.signals import pre_delete, post_init, post_save
from django.dispatch import receiver

from .models import ArchivoCotizacion, CondicionInicioProyectoCotizacion


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
