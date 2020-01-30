from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class LineaVendedor(models.Model):
    nombre = models.CharField(max_length=120, unique=True)


class Colaborador(models.Model):
    usuario = models.OneToOneField(
        User,
        related_name='mi_colaborador',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    cedula = models.CharField(max_length=20, unique=True)
    nombres = models.CharField(max_length=200, null=True, blank=True)
    apellidos = models.CharField(max_length=200, null=True, blank=True)

    porcentaje_caja_compensacion = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_pension = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_arl = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_salud = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_prestaciones_sociales = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    base_salario = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    auxilio_transporte = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    nro_horas_mes = models.PositiveIntegerField(default=0, null=True, blank=True)

    linea = models.ForeignKey(LineaVendedor, on_delete=models.PROTECT, null=True)

    cargo = models.ForeignKey(
        'cargues_catalogos.CargoColaboradorCatalogo',
        on_delete=models.PROTECT,
        null=True
    )
    centro_costo = models.ForeignKey(
        'cargues_catalogos.ColaboradorCentroCostoCatalogo',
        on_delete=models.PROTECT,
        related_name='costos_mensuales_colaboradores',
        null=True
    )

    activo = models.BooleanField(default=True)
    es_aprendiz = models.BooleanField(default=False)
    es_vendedor = models.BooleanField(default=False)
    en_proyectos = models.BooleanField(default=False)
    autogestion_horas_trabajadas = models.BooleanField(default=False)
    es_salario_fijo = models.BooleanField(default=False)

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
        self.save()

    def cambiar_activacion(self):
        user = self.usuario
        user.is_active = not user.is_active
        user.save()

    class Meta:
        permissions = [
            ("list_colaborador", "Can see list colaboradores"),
            ("detail_colaborador", "Can see detail colaborador"),
        ]

    def __str__(self):
        return '%s %s' % (self.nombres, self.apellidos)

    @property
    def full_name(self):
        return '%s %s' % (self.nombres, self.apellidos)


class ColaboradorCostoMes(models.Model):
    colaborador = models.ForeignKey(Colaborador, on_delete=models.PROTECT, related_name='costos_meses')
    lapso = models.DateField()
    costo = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    porcentaje_caja_compensacion = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_pension = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_arl = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_salud = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_prestaciones_sociales = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    nro_horas_mes = models.PositiveIntegerField(default=0)
    nro_horas_mes_trabajadas = models.PositiveIntegerField(default=0)
    base_salario = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    auxilio_transporte = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    otro_costo = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    es_salario_fijo = models.BooleanField(default=False)
    es_aprendiz = models.BooleanField(default=False)
    modificado = models.BooleanField(default=False)
    verificado = models.BooleanField(default=False)
    autogestion_horas_trabajadas = models.BooleanField(default=False)

    @property
    def valor_hora(self):
        if self.nro_horas_mes > 0:
            if self.nro_horas_mes_trabajadas > 0:
                return (self.costo + self.otro_costo) / self.nro_horas_mes_trabajadas
            return (self.costo + self.otro_costo) / self.nro_horas_mes
        return 0

    def calcular_costo_total(self):
        if not self.verificado:
            salario_base = self.base_salario
            caja_compensacion = salario_base * (self.porcentaje_caja_compensacion / 100)
            pension = salario_base * (self.porcentaje_pension / 100)
            salud = salario_base * (self.porcentaje_salud / 100)
            arl = salario_base * (self.porcentaje_arl / 100)
            prestaciones_sociales = (salario_base + self.auxilio_transporte) * (
                    self.porcentaje_prestaciones_sociales / 100)
            costo = salario_base + self.auxilio_transporte + arl
            if not self.es_aprendiz:
                costo += prestaciones_sociales
                costo += caja_compensacion
                costo += pension
                self.porcentaje_salud = 0
            else:
                self.porcentaje_prestaciones_sociales = 0
                self.porcentaje_caja_compensacion = 0
                self.porcentaje_pension = 0
                costo += salud
            self.costo = costo
            self.save()

    class Meta:
        permissions = [
            ("list_colaboradorcostomes", "Can see list colaborador costo mes"),
        ]
        unique_together = [('lapso', 'colaborador')]
