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
    item_biable = models.ForeignKey(ItemsBiable, on_delete=models.PROTECT)
    literal = models.ForeignKey(Literal, on_delete=models.CASCADE, verbose_name='mis_items_biable')
    cantidad = models.DecimalField(decimal_places=2, max_digits=10)
    costo_total = models.DecimalField(decimal_places=2, max_digits=12)

    class Meta:
        verbose_name = 'Item Literales Proyecto'
        verbose_name_plural = 'Items Literales Proyecto'
        unique_together = ['item_biable', 'literal']

    def __str__(self):
        return self.item_biable.descripcion


class CargosBiable(models.Model):
    id_cargo = models.PositiveIntegerField(primary_key=True)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    tipo_cargo = models.CharField(max_length=300, null=True, blank=True)


class ColaboradorBiable(models.Model):
    usuario = models.OneToOneField(User, related_name='colaborador', on_delete=models.SET_NULL, null=True, blank=True)
    cedula = models.CharField(max_length=20, unique=True)
    nombres = models.CharField(max_length=200, null=True, blank=True)
    apellidos = models.CharField(max_length=200, null=True, blank=True)
    en_proyectos = models.BooleanField(default=False)
    es_cguno = models.BooleanField(default=False)
    autogestion_horas_trabajadas = models.BooleanField(default=False)
    salario_fijo = models.BooleanField(default=False)
    cargo = models.ForeignKey(CargosBiable, on_delete=models.PROTECT, null=True, blank=True)

    def create_user(self):
        nombre_split = self.nombres.split()
        apellidos_split = self.apellidos.split()
        username = 'c-'
        for parte in nombre_split:
            username += parte[0:3]
        for parte in apellidos_split:
            username += parte[0:3]
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
            ("list_colaboradorbiable", "Can see list colaboradores CGUNO")
        ]

    def __str__(self):
        return '%s %s' % (self.nombres, self.apellidos)

    @property
    def full_name(self):
        return '%s %s' % (self.nombres, self.apellidos)
