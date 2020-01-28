from django.contrib.auth.models import User, Group
from django.db import models

from model_utils.models import TimeStampedModel

from clientes.models import ClienteBiable
from geografia.models import Ciudad
from sistema_informacion_origen.models import SistemaInformacionOrigen


class SeguimientoCargue(models.Model):
    fecha = models.DateTimeField()


class SeguimientoCargueProcedimiento(models.Model):
    cargue_contro = models.ForeignKey(SeguimientoCargue, on_delete=models.PROTECT, related_name='procedimientos')
    procedimiento_nombre = models.CharField(max_length=400)
    tarea = models.CharField(max_length=400)
    fecha = models.DateTimeField()
    numero_filas = models.BigIntegerField()


class PaisCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    pais_id = models.PositiveIntegerField()
    nombre = models.CharField(max_length=120)

    class Meta:
        permissions = [
            ("list_paiscatalogo", "Can list paises catalogos"),
        ]


class DepartamentoCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    departamento_id = models.PositiveIntegerField()
    nombre = models.CharField(max_length=120)
    pais = models.ForeignKey(PaisCatalogo, on_delete=models.PROTECT)

    class Meta:
        permissions = [
            ("list_departamentocatalogo", "Can list departamentos catalogos"),
        ]


class CiudadCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    ciudad_id = models.PositiveIntegerField()
    nombre = models.CharField(max_length=120)
    departamento = models.ForeignKey(DepartamentoCatalogo, on_delete=models.PROTECT)
    ciudad_intranet = models.ForeignKey(Ciudad, null=True, on_delete=models.PROTECT, related_name='ciudad_catalogo')

    class Meta:
        permissions = [
            ("list_ciudadcatalogo", "Can list ciudades catalogos"),
        ]


class CargosCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    id_cargo = models.PositiveIntegerField()
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    tipo_cargo = models.CharField(max_length=300, null=True, blank=True)

    class Meta:
        unique_together = [('sistema_informacion', 'id_cargo')]


class LineaVendedorCatalogo(models.Model):
    nombre = models.CharField(max_length=120, unique=True)


class ColaboradorCentroCostoCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    centro_costo_id = models.PositiveIntegerField()
    centro_costo_padre = models.ForeignKey('self', null=True, on_delete=models.PROTECT)
    nombre = models.CharField(unique=True, max_length=120)

    class Meta:
        unique_together = [('sistema_informacion', 'centro_costo_id')]
        permissions = [
            ("list_colaboradorcentrocostocatalogo", "Can see list centros costos colaboradores catalogo"),
        ]


class ColaboradorCatalogo(models.Model):
    usuario = models.OneToOneField(
        User,
        related_name='ncolaborador',
        on_delete=models.SET_NULL,
        null=True
    )
    cedula = models.CharField(max_length=20, unique=True)
    nombres = models.CharField(max_length=200, null=True)
    apellidos = models.CharField(max_length=200, null=True)
    porcentaje_caja_compensacion = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_pension = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_arl = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_salud = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_prestaciones_sociales = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    base_salario = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    auxilio_transporte = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    nro_horas_mes = models.PositiveIntegerField(default=0, null=True)
    cargo = models.ForeignKey(CargosCatalogo, on_delete=models.PROTECT, null=True)
    centro_costo = models.ForeignKey(
        ColaboradorCentroCostoCatalogo,
        on_delete=models.PROTECT,
        related_name='colaboradores',
        null=True
    )
    es_vendedor = models.BooleanField(default=False)
    es_aprendiz = models.BooleanField(default=False)
    en_proyectos = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    autogestion_horas_trabajadas = models.BooleanField(default=False)
    es_salario_fijo = models.BooleanField(default=False)
    linea = models.ForeignKey(LineaVendedorCatalogo, on_delete=models.PROTECT, null=True)

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
        permissions = [
            ("list_colaboradorcatalogo", "Can see list colaboradores")
        ]

    def __str__(self):
        return '%s %s' % (self.nombres, self.apellidos)

    @property
    def full_name(self):
        return '%s %s' % (self.nombres, self.apellidos)


class ClienteCatalogo(TimeStampedModel):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    nit = models.CharField(max_length=20)
    nombre = models.CharField(max_length=120)
    cliente_contacto = models.ForeignKey(
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
    id_item = models.PositiveIntegerField()
    id_referencia = models.CharField(max_length=20)
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

    desc_item_padre = models.CharField(max_length=400)
    unidad_medida_inventario = models.CharField(max_length=6)
    id_procedencia = models.CharField(max_length=1)

    class Meta:
        unique_together = [('sistema_informacion', 'id_item')]
        permissions = [
            ("list_itemscatalogo", "Can see list items catalogos")
        ]


class SucursalCatalogo(models.Model):
    sistema_informacion = models.ForeignKey(SistemaInformacionOrigen, on_delete=models.PROTECT)
    nro_sucursal = models.PositiveIntegerField()
    cliente = models.ForeignKey(ClienteCatalogo, related_name='sucursales', on_delete=models.PROTECT)
    nombre_establecimiento = models.CharField(max_length=200, null=True)
    nombre_establecimiento_alternativo = models.CharField(max_length=200, null=True)
    cupo_credito = models.DecimalField(max_digits=10, decimal_places=0)
    condicion_pago = models.PositiveIntegerField(null=True)
    activo = models.BooleanField()
    fecha_creacion = models.DateField()
    direccion = models.CharField(max_length=200)
    colaborador = models.ForeignKey(
        ColaboradorCatalogo,
        on_delete=models.PROTECT,
        null=True,
        related_name='clientes'
    )
    colaborador_real = models.ForeignKey(
        ColaboradorCatalogo,
        on_delete=models.PROTECT,
        null=True,
        related_name='clientes_asignados'
    )

    class Meta:
        unique_together = [('sistema_informacion', 'nro_sucursal', 'cliente')]
        permissions = [
            ("list_sucursalcatalogo", "Can see list sucursales catalogos")
        ]
