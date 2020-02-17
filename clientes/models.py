from django.db import models
from django.contrib.auth.models import User

from model_utils.models import TimeStampedModel

from colaboradores.models import Colaborador


class CanalDistribucion(TimeStampedModel):
    nombre = models.CharField(max_length=100, unique=True)

    class Meta:
        permissions = [
            ['list_canaldistribucion', 'Puede listar canales de distribucion'],
        ]


class TipoIndustria(TimeStampedModel):
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(max_length=300, null=True, blank=True)

    class Meta:
        permissions = [
            ['list_tipoindustria', 'Puede listar tipos industrias'],
        ]


class GrupoCliente(models.Model):
    nombre = models.CharField(max_length=120, unique=True)

    class Meta:
        permissions = [
            ['list_grupocliente', 'Puede listar grupos clientes'],
        ]


# Realmente cliente contacto
class ClienteBiable(TimeStampedModel):
    nit = models.CharField(max_length=20, null=True)
    nombre = models.CharField(max_length=200)
    forma_pago = models.CharField(max_length=120, null=True)

    grupo = models.ForeignKey(GrupoCliente, null=True, related_name='empresas', on_delete=models.PROTECT)
    fecha_creacion = models.DateField(null=True)
    canal = models.ForeignKey(CanalDistribucion, related_name='empresas', null=True, on_delete=models.PROTECT)
    industria = models.ForeignKey(TipoIndustria, related_name='empresas', null=True, on_delete=models.PROTECT)
    es_competencia = models.BooleanField(default=False)
    cliente_nuevo_nit = models.ForeignKey('self', null=True, related_name='cliente_viejo_nit', on_delete=models.PROTECT)
    nueva_desde_cotizacion = models.BooleanField(default=True)
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, null=True, related_name='clientes_creados')
    sincronizado_sistemas_informacion = models.BooleanField(default=False)

    colaborador_componentes = models.ForeignKey(
        Colaborador,
        on_delete=models.PROTECT,
        null=True,
        related_name='clientes_componentes'
    )
    colaborador_proyectos = models.ForeignKey(
        Colaborador,
        on_delete=models.PROTECT,
        null=True,
        related_name='clientes_proyectos'
    )

    class Meta:
        permissions = [
            ['list_clientebiable', 'Puede listar clientes'],
            ['detail_clientebiable', 'Puede ver detalle cliente'],
            ['can_fusionar_clientebiable', 'Puede Fusionar clientes'],
            ['can_cambiar_vendedor_componentes_clientebiable', 'Puede Cambiar Vendedor Componentes'],
            ['can_cambiar_vendedor_proyectos_clientebiable', 'Puede Cambiar Vendedor Proyectos'],
        ]


class ContactoCliente(TimeStampedModel):
    cliente = models.ForeignKey(ClienteBiable, on_delete=models.CASCADE, related_name='contactos')
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, related_name='contactos_creados')
    id_temporal_crm = models.BigIntegerField(null=True)
    nombres = models.CharField(max_length=200)
    pais = models.CharField(max_length=200, null=True)
    ciudad = models.CharField(max_length=200, null=True)
    apellidos = models.CharField(max_length=200)
    correo_electronico = models.EmailField(null=True)
    correo_electronico_2 = models.EmailField(null=True)
    telefono = models.CharField(max_length=120, null=True)
    telefono_2 = models.CharField(max_length=120, null=True)
    planta = models.CharField(max_length=120, null=True)
    empresa = models.CharField(max_length=120, null=True)
    cargo = models.CharField(max_length=200, null=True)
    nueva_desde_cotizacion = models.BooleanField(default=False)

    @property
    def full_nombre(self):
        return '%s %s' % (self.nombres, self.apellidos)

    class Meta:
        permissions = [
            ['list_contactocliente', 'Puede listar contactos clientes'],
        ]
