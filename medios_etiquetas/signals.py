from django.db.models.signals import pre_delete, post_init, post_save
from django.dispatch import receiver
from .models import Etiqueta


@receiver(pre_delete, sender=Etiqueta)
def imagen_etiqueta_pre_delete(sender, instance, **kwargs):
    instance.imagen.delete(False)


@receiver(post_init, sender=Etiqueta)
def backup_imagen_etiqueta_path(sender, instance, **kwargs):
    instance._current_imagen = instance.imagen


@receiver(post_save, sender=Etiqueta)
def delete_imagen_etiqueta(sender, instance, **kwargs):
    if hasattr(instance, '_current_imagen'):
        if instance._current_imagen != instance.imagen:
            print(instance._current_imagen)
            print(instance.imagen)
            instance._current_imagen.delete(save=False)