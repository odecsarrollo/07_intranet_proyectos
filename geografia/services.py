from .models import Ciudad, Pais, Departamento


def ciudad_departamento_ciudad_crear_desde_cotizacion(
        nuevo_pais: bool,
        nuevo_departamento: bool,
        pais_id: int = None,
        departamento_id: int = None,
        pais_nombre: str = None,
        departamento_nombre: str = None,
        ciudad_nombre: str = None,
) -> Ciudad:
    if nuevo_pais:
        pais = Pais.objects.create(
            nombre=pais_nombre,
            nueva_desde_cotizacion=True
        )
    else:
        pais = Pais.objects.get(pk=pais_id)

    if nuevo_departamento or nuevo_pais:
        departamento = Departamento.objects.create(
            nombre=departamento_nombre,
            pais=pais,
            nueva_desde_cotizacion=True
        )
    else:
        departamento = Departamento.objects.get(pk=departamento_id)

    ciudad = Ciudad.objects.create(
        nombre=ciudad_nombre,
        nueva_desde_cotizacion=True,
        departamento=departamento
    )

    return ciudad
