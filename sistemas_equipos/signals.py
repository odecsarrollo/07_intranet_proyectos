from django.db.models.signals import pre_delete, post_init, post_save
from django.dispatch import receiver
from .models import EquipoCelularFoto, EquipoComputadorFoto


# signals for computer photos

@receiver(pre_delete, sender=EquipoComputadorFoto)
def foto_computador_pre_delete(sender, instance, **kwargs):
    instance.foto.delete(False)


@receiver(post_init, sender=EquipoComputadorFoto)
def backup_foto_computador_path(sender, instance, **kwargs):
    instance._current_imagen = instance.foto


@receiver(post_save, sender=EquipoComputadorFoto)
def delete_foto_computador(sender, instance, **kwargs):
    if hasattr(instance, '_current_imagen'):
        if instance._current_imagen != instance.foto:
            instance._current_imagen.delete(save=False)


# signals for cell phone photos

@receiver(pre_delete, sender=EquipoCelularFoto)
def foto_celular_pre_delete(sender, instance, **kwargs):
    instance.foto.delete(False)


@receiver(post_init, sender=EquipoCelularFoto)
def backup_foto_celular_path(sender, instance, **kwargs):
    instance._current_imagen = instance.foto


@receiver(post_save, sender=EquipoCelularFoto)
def delete_foto_celular(sender, instance, **kwargs):
    if hasattr(instance, '_current_imagen'):
        if instance._current_imagen != instance.foto:
            instance._current_imagen.delete(save=False)
