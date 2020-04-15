from django.contrib.auth.models import User
from rest_framework import serializers


def user_cambiar_contrasena(
        usuario_id: int,
        password_old: str,
        password_nuevo: str,
        password_nuevo_confirmacion: str
) -> User:
    user = User.objects.get(pk=usuario_id)
    if not user.check_password(password_old):
        raise serializers.ValidationError({'_error': 'La contraseña suministrada no coincide con el usuario'})
    if not password_nuevo == password_nuevo_confirmacion:
        raise serializers.ValidationError({'_error': 'La contraseña nueva con su confirmación no coincide'})
    user.set_password(password_nuevo)
    user.save()
    return user
