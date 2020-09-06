from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from imagekit.models import ProcessedImageField
from model_utils.models import TimeStampedModel
from pilkit.processors import ResizeToFit

from proyectos_equipos.models import EquipoProyecto
from proyectos_equipos.models import TipoEquipo, TipoEquipoClase


class PostventaRutinaTipoEquipo(models.Model):
    tipo_equipo = models.ForeignKey(
        TipoEquipo,
        on_delete=models.PROTECT,
        related_name='rutinas_postventa',
        db_column='tip_equ',
        null=True
    )
    tipo_equipo_clase = models.ForeignKey(
        TipoEquipoClase,
        on_delete=models.PROTECT,
        related_name='rutinas_postventa',
        db_column='tip_equ_cla',
        null=True
    )
    descripcion = models.TextField(db_column='desc')
    mes = models.PositiveIntegerField()

    class Meta:
        db_table = 'postv_ruti_tip_equi'
        permissions = [
            ("list_postventarutinatipoequipo", "Can list posventa rutinas tipo equipo"),
        ]


class PostventaGarantia(TimeStampedModel):
    equipo = models.ForeignKey(EquipoProyecto, on_delete=models.PROTECT, related_name='garantias', db_column='equ')
    descripcion = models.TextField(db_column='desc')
    fecha_inicial = models.DateField(db_column='fec_ini')
    fecha_final = models.DateField(db_column='fec_fin')
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')


class PostventaEventoEquipo(TimeStampedModel):
    ESTADO_CHOICES = (
        ('SOL', 'Solicitado'),
        ('PRO', 'En Proceso'),
        ('FIN', 'Finalizado'),
    )
    TIPO_CHOICES = (
        ('MONTAJE', 'Montaje'),
        ('MODIFICACION', 'Modificación'),
        ('GARANTIA', 'Garantía'),
        ('AJUSTE', 'Ajuste'),
        ('ASISTENCIA_TECNICA', 'Asistencia Técnica'),
        ('REPARACION', 'Reparación'),
    )
    equipo = models.ForeignKey(
        EquipoProyecto,
        on_delete=models.PROTECT,
        related_name='ordenes_servicio'
    )
    descripcion = models.TextField(db_column='desc')
    fecha_solicitud = models.DateField(db_column='fec_sol')
    fecha_inicial = models.DateField(db_column='fec_ini')
    fecha_final = models.DateField(db_column='fec_fin', null=True)
    tipo = models.CharField(choices=TIPO_CHOICES, max_length=120)
    estado = models.CharField(choices=ESTADO_CHOICES, max_length=120)
    tecnico_a_cargo = models.CharField(max_length=200, db_column='tec_a_car')
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')


def postventa_evento_equipo_documento_upload_to(instance, filename):
    ahora = timezone.datetime.now()
    return "documentos/psventa/eve_equi/%s/%s%s%s%s%s" % (
        instance.equipo.identificador, ahora.year, ahora.month, ahora.day, ahora.microsecond, filename)


class PostventaEventoEquipoDocumento(models.Model):
    equipo = models.ForeignKey(
        EquipoProyecto,
        related_name='documentos',
        on_delete=models.PROTECT,
        db_column='equ'
    )
    nombre_archivo = models.CharField(max_length=120, db_column='nombre')
    archivo = models.FileField(upload_to=postventa_evento_equipo_documento_upload_to, db_column='file', null=True)
    imagen = ProcessedImageField(
        processors=[ResizeToFit(1080, 720)],
        format='JPEG',
        options={'quality': 70},
        upload_to=postventa_evento_equipo_documento_upload_to,
        db_column='img',
        null=True
    )
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')

    class Meta:
        db_table = 'postventa_even_equip_docs'
        permissions = [
            ("list_postventaeventoequipodocumento", "Can list documentos evento postventa equipo"),
        ]
