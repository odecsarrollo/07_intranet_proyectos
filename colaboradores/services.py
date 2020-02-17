from django.contrib.auth.models import User

from .models import Colaborador


def colaborador_crear_usuario(colaborador_id: int) -> Colaborador:
    colaborador = Colaborador.objects.get(pk=colaborador_id)
    if colaborador.usuario is None:
        nombre_split = colaborador.nombres.split()
        apellidos_split = colaborador.apellidos.split()
        username = 'c-'
        for parte in nombre_split:
            username += parte[0:3]
        for parte in apellidos_split:
            username += parte[0:3]
        if User.objects.filter(username=username).exists():
            username = '%s%s' % (username, User.objects.filter(username=username).count())
        user = User.objects.create_user(
            username=username.lower(),
            password=colaborador.cedula,
            first_name=colaborador.nombres.upper(),
            last_name=colaborador.apellidos.upper()
        )
        colaborador.usuario = user
        colaborador.save()
    return colaborador
