from django.db import models
from django.contrib.auth.models import User, Group
from proyectos.models import Literal


class ItemsBiable(models.Model):
    id_item = models.PositiveIntegerField(primary_key=True)
    id_referencia = models.CharField(max_length=20)
    descripcion = models.CharField(max_length=40)
    descripcion_dos = models.CharField(max_length=40)
    activo = models.BooleanField(default=True)
    nombre_tercero = models.CharField(max_length=120)
    desc_item_padre = models.CharField(max_length=40)
    unidad_medida_inventario = models.CharField(max_length=6)
    id_procedencia = models.CharField(max_length=1)
    ultimo_costo = models.DecimalField(max_digits=18, decimal_places=3, default=0)

    class Meta:
        verbose_name = 'Item'
        verbose_name_plural = 'Items'
        permissions = [
            ("list_itemsbiable", "Can see list items CGUNO"),
            ("ultimo_costo_itemsbiable", "Can see ultimo costo items CGUNO"),
        ]

    def __str__(self):
        return self.descripcion


class ItemsLiteralBiable(models.Model):
    lapso = models.DateField()
    item_biable = models.ForeignKey(ItemsBiable, on_delete=models.PROTECT)
    literal = models.ForeignKey(Literal, on_delete=models.CASCADE, verbose_name='mis_items_biable')
    cantidad = models.DecimalField(decimal_places=2, max_digits=10)
    costo_total = models.DecimalField(decimal_places=2, max_digits=12)

    class Meta:
        verbose_name = 'Item Literales Proyecto'
        verbose_name_plural = 'Items Literales Proyecto'
        unique_together = [('item_biable', 'literal','lapso')]

    def __str__(self):
        return self.item_biable.descripcion


class CargosBiable(models.Model):
    id_cargo = models.PositiveIntegerField(primary_key=True)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    tipo_cargo = models.CharField(max_length=300, null=True, blank=True)


class ColaboradorCentroCosto(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    centro_costo_padre = models.ForeignKey('self', null=True, blank=True, on_delete=models.PROTECT)
    nombre = models.CharField(unique=True, max_length=120)

    class Meta:
        permissions = [
            ("list_colaboradorcentrocosto", "Can see list centros costos colaboradores"),
        ]


class ColaboradorBiable(models.Model):
    usuario = models.OneToOneField(User, related_name='colaborador', on_delete=models.SET_NULL, null=True, blank=True)
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
    cargo = models.ForeignKey(CargosBiable, on_delete=models.PROTECT, null=True, blank=True)
    centro_costo = models.ForeignKey(ColaboradorCentroCosto, on_delete=models.PROTECT, related_name='mis_colaboradores',
                                     null=True, blank=True)
    literales_autorizados = models.ManyToManyField(Literal, related_name='colaboradores_autorizados')
    es_aprendiz = models.BooleanField(default=False)
    en_proyectos = models.BooleanField(default=False)
    es_cguno = models.BooleanField(default=False)
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
        new_group, created = Group.objects.get_or_create(name='Autogestion Horas Trabajo')
        user.groups.add(new_group)
        self.save()

    def cambiar_activacion(self):
        user = self.usuario
        user.is_active = not user.is_active
        user.save()

    class Meta:
        verbose_name = 'Colaborador'
        verbose_name_plural = 'Colaboradores'
        permissions = [
            ("list_colaboradorbiable", "Can see list colaboradores CGUNO"),
            ("detail_colaboradorbiable", "Can see detail colaborador CGUNO"),
        ]

    def __str__(self):
        return '%s %s' % (self.nombres, self.apellidos)

    @property
    def full_name(self):
        return '%s %s' % (self.nombres, self.apellidos)


class ColaboradorCostoMesBiable(models.Model):
    colaborador = models.ForeignKey(ColaboradorBiable, on_delete=models.PROTECT, related_name='mis_costos')
    lapso = models.DateField()
    costo = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    porcentaje_caja_compensacion = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_pension = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_arl = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_salud = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    porcentaje_prestaciones_sociales = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    nro_horas_mes = models.PositiveIntegerField(default=0, null=True, blank=True)
    nro_horas_mes_trabajadas = models.PositiveIntegerField(default=0, null=True, blank=True)
    base_salario = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    auxilio_transporte = models.DecimalField(max_digits=20, decimal_places=2, default=0)
    centro_costo = models.ForeignKey(ColaboradorCentroCosto, on_delete=models.PROTECT,
                                     related_name='mis_coloaboradores_costos_mensuales',
                                     null=True, blank=True)
    es_salario_fijo = models.BooleanField(default=False)
    es_aprendiz = models.BooleanField(default=False)
    modificado = models.BooleanField(default=False)
    verificado = models.BooleanField(default=False)
    autogestion_horas_trabajadas = models.BooleanField(default=False)

    @property
    def valor_hora(self):
        if self.nro_horas_mes > 0:
            if self.nro_horas_mes_trabajadas > 0:
                return self.costo / self.nro_horas_mes_trabajadas
            return self.costo / self.nro_horas_mes
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
            ("list_colaboradorcostomesbiable", "Can see list colaborador costo mes"),
        ]
        unique_together = [('lapso', 'colaborador')]
