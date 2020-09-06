from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from model_utils.models import TimeStampedModel

from proyectos.models import Literal


class TipoEquipo(models.Model):
    nombre = models.CharField(max_length=120)
    activo = models.BooleanField(default=True)
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')
    sigla = models.CharField(unique=True, max_length=2)

    class Meta:
        db_table = 'tip_equip_proy'
        permissions = [
            ("list_tipoequipo", "Can list tipos equipos"),
        ]


class TipoEquipoClase(models.Model):
    tipo_equipo = models.ForeignKey(
        TipoEquipo,
        on_delete=models.PROTECT,
        related_name='clases_tipo_equipo',
        db_column='tip_equ'
    )
    nombre = models.CharField(max_length=120)
    sigla = models.CharField(unique=True, max_length=2)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'tip_equip_clase'
        unique_together = (('sigla', 'tipo_equipo'),)
        permissions = [
            ("list_tipoequipoclase", "Can list clases tipo equipo"),
        ]


class TipoEquipoDocumento(models.Model):
    def documento_upload_to(instance, filename):
        ahora = timezone.datetime.now()
        if instance.tipo_equipo is not None:
            return "documentos/tipos_equipos/%s/%s%s%s%s%s" % (
                instance.tipo_equipo.id, ahora.year, ahora.month, ahora.day, ahora.microsecond, filename)
        else:
            return "documentos/tipos_equipos_clases/%s/%s%s%s%s%s" % (
                instance.tipo_equipo_clase.id, ahora.year, ahora.month, ahora.day, ahora.microsecond, filename)

    tipo_equipo = models.ForeignKey(
        TipoEquipo,
        related_name='documentos',
        on_delete=models.PROTECT,
        db_column='tip_equ',
        null=True
    )
    tipo_equipo_clase = models.ForeignKey(
        TipoEquipoClase,
        on_delete=models.PROTECT,
        related_name='documentos',
        db_column='tip_equ_cla',
        null=True
    )
    nombre_archivo = models.CharField(max_length=120, db_column='nombre')
    archivo = models.FileField(upload_to=documento_upload_to, db_column='file')
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')

    class Meta:
        db_table = 'tip_equip_docs'
        permissions = [
            ("list_tipoequipodocumento", "Can list documentos tipo equipo"),
        ]


class TipoEquipoCampo(models.Model):
    TIPO_CHOICES = (
        ('NUMBER', 'Número'),
        ('TEXT', 'Texto'),
        ('LIST', 'Lista'),
    )
    label = models.CharField(max_length=120)
    tamano = models.PositiveIntegerField(default=100)
    tamano_columna = models.PositiveIntegerField(default=12)
    orden = models.PositiveIntegerField(default=0)
    unidad_medida = models.CharField(max_length=100, db_column='um', null=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='TEXT', db_column='tip')
    tipo_equipo = models.ForeignKey(
        TipoEquipo,
        on_delete=models.PROTECT,
        related_name='campos',
        db_column='tip_equ',
        null=True
    )
    tipo_equipo_clase = models.ForeignKey(
        TipoEquipoClase,
        on_delete=models.PROTECT,
        related_name='campos',
        db_column='tip_equ_cla',
        null=True
    )
    opciones_list = models.TextField(null=True, db_column='lst_opt')
    obligatorio = models.BooleanField(default=True)

    class Meta:
        db_table = 'tip_equip_campos'
        permissions = [
            ("list_tipoequipocampo", "Can list campos tipo equipo"),
        ]


class EquipoProyecto(TimeStampedModel):
    identificador = models.CharField(max_length=100, unique=True, db_column='ident')
    nro_consecutivo = models.PositiveIntegerField(db_column='nro_conse')
    literal = models.ForeignKey(
        Literal,
        related_name='equipos',
        on_delete=models.PROTECT
    )
    fecha_entrega = models.DateField(null=True, db_column='fec_entre')
    fecha_fabricacion = models.DateField(null=True, db_column='fec_fabri')
    nombre = models.CharField(max_length=200)
    tipo_equipo_clase = models.ForeignKey(
        TipoEquipoClase,
        related_name='equipos',
        on_delete=models.PROTECT,
        db_column='tip_equ_cla'
    )
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')

    class Meta:
        db_table = 'equip_proy'
        unique_together = (('literal', 'nro_consecutivo'),)
        permissions = [
            ("list_equipoproyecto", "Can list equipos proyectos"),
        ]


class TipoEquipoCampoEquipo(models.Model):
    equipo = models.ForeignKey(
        EquipoProyecto,
        on_delete=models.PROTECT,
        related_name='campos_valores',
        db_column='equ'
    )
    tamano = models.PositiveIntegerField()
    tamano_columna = models.PositiveIntegerField(default=12)
    tipo = models.CharField(max_length=20)
    label = models.CharField(max_length=120)
    valor = models.CharField(max_length=200)
    unidad_medida = models.CharField(max_length=100, db_column='um')
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'equip_proy_campos'
        permissions = [
            ("list_tipoequipocampoequipo", "Can list equipo poryecto campos"),
        ]
