from rest_framework.exceptions import ValidationError

from .models import ContactoCliente, ClienteBiable


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
) -> ContactoCliente:
    if nuevo_cliente:
        if cliente_nit:
            cliente_con_nit = ClienteBiable.objects.filter(nit=cliente_nit)
            if cliente_con_nit.exists():
                raise ValidationError(
                    {'error:': 'El nit ya existe para el cliente %s' % cliente_con_nit.first().nombre})

        cliente = ClienteBiable.objects.create(
            nombre=cliente_nombre,
            nit=cliente_nit,
            nueva_desde_cotizacion=True
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
    cliente_eliminar.delete()
    return cliente_permanece


def fusionar_contactos(
        contacto_que_permanece_id: int,
        contacto_a_eliminar_id: int
) -> ContactoCliente:
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
