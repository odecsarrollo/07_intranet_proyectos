from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError

from .models import ContactoCliente, ClienteBiable
from colaboradores.models import Colaborador


def contacto_cliente_crear_desde_cotizacion(
        nuevo_cliente: bool,
        creado_por_id: int,
        cliente_nombre: str = None,
        cliente_nit: str = None,
        cliente_id: int = None,
        nombres: str = None,
        apellidos: str = None,
        correo_electronico: str = None,
        correo_electronico_2: str = None,
        pais: str = None,
        cargo: str = None,
        ciudad: str = None,
        telefono: str = None,
        telefono_2: str = None,
        tipo_cotizacion: str = 'Proyectos'
) -> ContactoCliente:
    if nuevo_cliente:
        usuario = User.objects.get(pk=creado_por_id)
        colaborador = None
        if hasattr(usuario, 'mi_colaborador'):
            if usuario.mi_colaborador.es_vendedor:
                colaborador = usuario.mi_colaborador
        if cliente_nit:
            cliente_con_nit = ClienteBiable.objects.filter(nit=cliente_nit)
            if cliente_con_nit.exists():
                raise ValidationError(
                    {'_error': 'El nit ya existe para el cliente %s' % cliente_con_nit.first().nombre})

        cliente = ClienteBiable.objects.create(
            nombre=cliente_nombre,
            nit=cliente_nit,
            nueva_desde_cotizacion=True,
            creado_por_id=creado_por_id,
            colaborador_componentes_id=colaborador.id if colaborador is not None and tipo_cotizacion == 'Componentes' else None,
            colaborador_proyectos_id=colaborador.id if colaborador is not None and tipo_cotizacion == 'Proyectos' else None,
        )
    else:
        cliente = ClienteBiable.objects.get(pk=cliente_id)
    contacto = ContactoCliente.objects.create(
        cliente=cliente,
        creado_por_id=creado_por_id,
        nombres=nombres,
        apellidos=apellidos,
        correo_electronico=correo_electronico,
        correo_electronico_2=correo_electronico_2,
        telefono=telefono,
        telefono_2=telefono_2,
        cargo=cargo,
        ciudad=ciudad,
        pais=pais,
        nueva_desde_cotizacion=True
    )

    return contacto


def asignar_colaborador_vendedor_proyectos(
        cliente_id: int,
        colaborador_id: int = None
) -> Colaborador:
    cliente = ClienteBiable.objects.get(pk=cliente_id)
    if colaborador_id is None:
        cliente.colaborador_proyectos = None
        colaborador_proyectos = None
    else:
        colaborador_proyectos = Colaborador.objects.get(pk=colaborador_id)
        if colaborador_proyectos.usuario is None:
            raise ValidationError(
                {'_error': 'El colaborador a asignar como vendedor de proyectos debe tener un usuario definido'}
            )
        cliente.colaborador_proyectos_id = colaborador_id
    cliente.save()
    return colaborador_proyectos


def asignar_colaborador_vendedor_componentes(
        cliente_id: int,
        colaborador_id: int = None
) -> Colaborador:
    cliente = ClienteBiable.objects.get(pk=cliente_id)
    if colaborador_id is None:
        cliente.colaborador_componentes = None
        colaborador_componentes = None
    else:
        colaborador_componentes = Colaborador.objects.get(pk=colaborador_id)
        if colaborador_componentes.usuario is None:
            raise ValidationError(
                {'_error': 'El colaborador a asignar como vendedor de componentes debe tener un usuario definido'}
            )
        cliente.colaborador_componentes_id = colaborador_id
    cliente.save()
    return colaborador_componentes


def fusionar_clientes(
        cliente_que_permanece_id: int,
        cliente_a_eliminar_id: int
) -> ClienteBiable:
    cliente_permanece = ClienteBiable.objects.get(pk=cliente_que_permanece_id)
    if not cliente_permanece.sincronizado_sistemas_informacion:
        raise ValidationError({'_error': 'No se puede fusionar un cliente no sincronizado con uno a eliminar'})
    cliente_eliminar = ClienteBiable.objects.get(pk=cliente_a_eliminar_id)

    for proyecto in cliente_eliminar.proyectos.all():
        proyecto.cliente_id = cliente_que_permanece_id
        proyecto.save()

    for cotizacion in cliente_eliminar.cotizaciones_proyectos.all():
        cotizacion.cliente_id = cliente_que_permanece_id
        cotizacion.save()

    for cotizacion in cliente_eliminar.cotizaciones_componentes.all():
        cotizacion.cliente_id = cliente_que_permanece_id
        cotizacion.save()

    for contacto in cliente_eliminar.contactos.all():
        contacto.cliente_id = cliente_que_permanece_id
        contacto.save()

    for cliente_catalogo in cliente_eliminar.clientes_sistemas_informacion.all():
        cliente_catalogo.cliente_id = cliente_que_permanece_id
        cliente_catalogo.save()
    cliente_eliminar.delete()
    return cliente_permanece


def fusionar_contactos(
        contacto_que_permanece_id: int,
        contacto_a_eliminar_id: int
) -> ContactoCliente:
    if contacto_que_permanece_id == contacto_a_eliminar_id:
        raise ValidationError({'_error': 'Los contactos a fusionar no pueden ser los mismos registros'})
    contacto_eliminar = ContactoCliente.objects.get(pk=contacto_a_eliminar_id)
    for cotizacion in contacto_eliminar.cotizaciones_componentes.all():
        cotizacion.contacto_id = contacto_que_permanece_id
        cotizacion.save()

    for cotizacion in contacto_eliminar.cotizaciones_proyectos.all():
        cotizacion.contacto_cliente_id = contacto_que_permanece_id
        cotizacion.save()
    contacto_eliminar.delete()
    contacto_permanece = ContactoCliente.objects.get(pk=contacto_que_permanece_id)
    return contacto_permanece
