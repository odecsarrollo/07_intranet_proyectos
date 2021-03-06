from django.contrib.auth.models import User, Group
from django.db import models

from model_utils.models import TimeStampedModel

from clientes.models import ClienteBiable
from geografia.models import Ciudad
from sistema_informacion_origen.models import SistemaInformacionOrigen
from colaboradores.models import Colaborador


class SeguimientoCargue(models.Model):
    fecha = models.DateTimeField()
    fecha_final = models.DateTimeField(null=True)
    descripcion = models.CharField(max_length=400, default='Cargue Completo')

    class Meta:
        permissions = [
            ("list_seguimientocargue", "Can list seguimientos cargues"),
        ]


class SeguimientoCargueProcedimiento(models.Model):
    cargue_contro = models.ForeignKey(SeguimientoCargue, on_delete=models.PROTECT, related_name='procedimientos')
    procedimiento_nombre = models.CharField(max_length=400)
    tabla = models.CharField(max_length=400, default='default')
    tarea = models.CharField(max_length=400)
    fecha = models.DateTimeField()
    fecha_final = models.DateTimeField(null=True)
    numero_filas = models.BigIntegerField()


class UnidadMedidaCatalogo(models.Model):
    id = models.CharField(max_length=6, primary_key=True)
    descripcion = models.CharField(max_length=100)
    decimales = models.PositiveIntegerField(default=0)
    sincronizado_sistema_informacion = models.BooleanField(default=0)
    activo = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ("list_unidadmedidacatalogo", "Can list unidades medidas catalogo"),
        ]


class CargoColaboradorCatalogo(models.Model):
    cargo_id = models.PositiveIntegerField()
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    tipo_cargo = models.CharField(max_length=300, null=True, blank=True)
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)


class PaisCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    pais_id = models.PositiveIntegerField(db_index=True)
    nombre = models.CharField(max_length=120)

    class Meta:
        permissions = [
            ("list_paiscatalogo", "Can list paises catalogos"),
        ]


class DepartamentoCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    departamento_id = models.PositiveIntegerField(db_index=True)
    nombre = models.CharField(max_length=120)
    pais = models.ForeignKey(PaisCatalogo, on_delete=models.PROTECT)

    class Meta:
        permissions = [
            ("list_departamentocatalogo", "Can list departamentos catalogos"),
        ]


class CiudadCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    ciudad_id = models.PositiveIntegerField(db_index=True)
    nombre = models.CharField(max_length=120)
    departamento = models.ForeignKey(DepartamentoCatalogo, on_delete=models.PROTECT)
    ciudad_intranet = models.ForeignKey(Ciudad, null=True, on_delete=models.PROTECT, related_name='ciudad_catalogo')

    class Meta:
        permissions = [
            ("list_ciudadcatalogo", "Can list ciudades catalogos"),
        ]


# class CargosCatalogo(models.Model):
#     sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
#     id_cargo = models.PositiveIntegerField()
#     descripcion = models.CharField(max_length=300, null=True, blank=True)
#     tipo_cargo = models.CharField(max_length=300, null=True, blank=True)
#
#     class Meta:
#         unique_together = [('sistema_informacion', 'id_cargo')]


class ColaboradorCentroCostoCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    centro_costo_id = models.PositiveIntegerField()
    centro_costo_padre = models.ForeignKey('self', null=True, on_delete=models.PROTECT)
    nombre = models.CharField(max_length=120)

    class Meta:
        unique_together = [('sistema_informacion', 'centro_costo_id')]
        permissions = [
            ("list_colaboradorcentrocostocatalogo", "Can see list centros costos colaboradores catalogo"),
        ]


class ColaboradorCatalogo(models.Model):
    colaborador = models.ForeignKey(
        Colaborador,
        related_name='colaborador_sistema_informacion',
        on_delete=models.PROTECT,
        null=True
    )
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    cedula = models.CharField(max_length=20)
    nombres = models.CharField(max_length=200, null=True)
    apellidos = models.CharField(max_length=200, null=True)
    tercero_id = models.BigIntegerField(null=True)

    def create_user(self):
        nombre_split = self.nombres.split()
        apellidos_split = self.apellidos.split()
        username = 'c-'
        for parte in nombre_split:
            username += parte[0:3]
        for parte in apellidos_split:
            username += parte[0:3]
        if User.objects.filter(username=username).exists():
            username = '%s%s' % (username, User.objects.filter(username=username).count())
        user = User.objects.create_user(
            username=username.lower(),
            password=self.cedula,
            first_name=self.nombres.upper(),
            last_name=self.apellidos.upper()
        )
        self.usuario = user
        new_group, created = Group.objects.get_or_create(name='Autogestion Horas Trabajo')
        user.groups.add(new_group)
        self.save()

    def cambiar_activacion(self):
        user = self.usuario
        user.is_active = not user.is_active
        user.save()

    class Meta:
        unique_together = [('sistema_informacion', 'cedula')]
        permissions = [
            ("list_colaboradorcatalogo", "Can see list colaboradores catalogos")
        ]

    def __str__(self):
        return '%s %s' % (self.nombres, self.apellidos)

    @property
    def full_name(self):
        return '%s %s' % (self.nombres, self.apellidos)


class ClienteCatalogo(TimeStampedModel):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    tercero_id = models.BigIntegerField(null=True)
    nit = models.CharField(max_length=20, db_index=True)
    nombre = models.CharField(max_length=200)
    cliente = models.ForeignKey(
        ClienteBiable,
        on_delete=models.PROTECT,
        related_name='clientes_sistemas_informacion',
        null=True
    )

    class Meta:
        unique_together = [('sistema_informacion', 'nit')]
        permissions = [
            ("list_clientecatalogo", "Can see list clientes catalogos")
        ]


class ItemsCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    id_item = models.PositiveIntegerField(db_index=True)
    id_referencia = models.CharField(max_length=40)
    descripcion = models.CharField(max_length=40)
    descripcion_dos = models.CharField(max_length=40)
    activo = models.BooleanField(default=True)
    nombre_tercero = models.CharField(max_length=120)
    ultimo_costo = models.DecimalField(max_digits=18, decimal_places=3, default=0)

    linea = models.CharField(max_length=120, null=True)
    categoria_mercadeo = models.CharField(max_length=120, null=True)
    categoria_mercadeo_dos = models.CharField(max_length=120, null=True)
    categoria_mercadeo_tres = models.CharField(max_length=120, null=True)
    serie = models.CharField(max_length=30, null=True)
    ancho = models.CharField(max_length=60, null=True)
    alto = models.CharField(max_length=60, null=True)
    longitud = models.CharField(max_length=60, null=True)
    diametro = models.CharField(max_length=60, null=True)
    dientes = models.CharField(max_length=10, null=True)
    material = models.CharField(max_length=100, null=True)
    color = models.CharField(max_length=30, null=True)

    marca = models.CharField(max_length=200, null=True)
    desc_item_padre = models.CharField(max_length=400)
    unidad_medida_en_inventario = models.ForeignKey(UnidadMedidaCatalogo, null=True, on_delete=models.PROTECT)
    id_procedencia = models.CharField(max_length=1)

    class Meta:
        unique_together = [('sistema_informacion', 'id_item')]
        permissions = [
            ("list_itemscatalogo", "Can see list items catalogos")
        ]


class SucursalCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    nro_sucursal = models.PositiveIntegerField()
    cliente = models.ForeignKey(ClienteBiable, related_name='sucursales', on_delete=models.PROTECT)
    nombre_establecimiento = models.CharField(max_length=200, null=True)
    nombre_establecimiento_alternativo = models.CharField(max_length=200, null=True)
    cupo_credito = models.DecimalField(max_digits=10, decimal_places=0)
    condicion_pago = models.PositiveIntegerField(null=True)
    activo = models.BooleanField()
    fecha_creacion = models.DateField()
    direccion = models.CharField(max_length=200)
    colaborador = models.ForeignKey(
        Colaborador,
        on_delete=models.PROTECT,
        null=True,
        related_name='sucursales_sistema_informacion'
    )
    colaborador_real = models.ForeignKey(
        Colaborador,
        on_delete=models.PROTECT,
        null=True,
        related_name='sucursales_asignadas'
    )

    class Meta:
        unique_together = [('sistema_informacion', 'nro_sucursal', 'cliente')]
        permissions = [
            ("list_sucursalcatalogo", "Can see list sucursales catalogos")
        ]
