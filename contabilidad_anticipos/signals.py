from django.db.models.signals import pre_delete, post_init, post_save
from django.dispatch import receiver

from .models import ProformaConfiguracion, ProformaAnticipoArchivo


@receiver(pre_delete, sender=ProformaConfiguracion)
def firma_configuracion_proforma_pre_delete(sender, instance, **kwargs):
    instance.firma.delete(False)


@receiver(post_init, sender=ProformaConfiguracion)
def backup_firma_configuracion_proforma_path(sender, instance, **kwargs):
    instance._current_firma = instance.firma


@receiver(post_save, sender=ProformaConfiguracion)
def delete_firma_configuracion_proforma_(sender, instance, **kwargs):
    if hasattr(instance, '_current_firma'):
        if instance._current_firma != instance.firma:
            instance._current_firma.delete(save=False)


@receiver(pre_delete, sender=ProformaConfiguracion)
def encabezado_configuracion_proforma_pre_delete(sender, instance, **kwargs):
    instance.encabezado.delete(False)


@receiver(post_init, sender=ProformaConfiguracion)
def backup_encabezado_configuracion_proforma_path(sender, instance, **kwargs):
    instance._current_encabezado = instance.encabezado


@receiver(post_save, sender=ProformaConfiguracion)
def delete_encabezado_configuracion_proforma_(sender, instance, **kwargs):
    if hasattr(instance, '_current_encabezado'):
        if instance._current_encabezado != instance.encabezado:
            instance._current_encabezado.delete(save=False)


@receiver(pre_delete, sender=ProformaAnticipoArchivo)
def proforma_archivo_pre_delete(sender, instance, **kwargs):
    instance.archivo.delete(False)


@receiver(post_init, sender=ProformaAnticipoArchivo)
def backup_proforma_archivo_path(sender, instance, **kwargs):
    instance._current_archivo = instance.archivo


@receiver(post_save, sender=ProformaAnticipoArchivo)
def delete_proforma_archivo_proforma_(sender, instance, **kwargs):
    if hasattr(instance, '_current_archivo'):
        if instance._current_archivo != instance.archivo:
            instance._current_archivo.delete(save=False)
