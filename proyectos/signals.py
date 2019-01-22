from django.db.models.signals import pre_delete, post_init, post_save
from django.dispatch import receiver

from .models import ArchivoProyecto, ArchivoLiteral


@receiver(pre_delete, sender=ArchivoProyecto)
def archivo_proyecto_pre_delete(sender, instance, **kwargs):
    instance.archivo.delete(False)


@receiver(post_init, sender=ArchivoProyecto)
def backup_archivo_proyecto_path(sender, instance, **kwargs):
    instance._current_archivo = instance.archivo


@receiver(post_save, sender=ArchivoProyecto)
def delete_archivo_proyecto(sender, instance, **kwargs):
    if hasattr(instance, '_current_archivo'):
        if instance._current_archivo != instance.archivo:
            instance._current_archivo.delete(save=False)


@receiver(pre_delete, sender=ArchivoLiteral)
def archivo_literal_pre_delete(sender, instance, **kwargs):
    instance.archivo.delete(False)


@receiver(post_init, sender=ArchivoLiteral)
def backup_archivo_literal_path(sender, instance, **kwargs):
    instance._current_archivo = instance.archivo


@receiver(post_save, sender=ArchivoLiteral)
def delete_archivo_literal(sender, instance, **kwargs):
    if hasattr(instance, '_current_archivo'):
        if instance._current_archivo != instance.archivo:
            instance._current_archivo.delete(save=False)
