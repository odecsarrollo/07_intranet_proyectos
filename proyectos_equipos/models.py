from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

from proyectos.models import Literal


class TipoEquipo(models.Model):
    nombre = models.CharField(max_length=120)
    activo = models.BooleanField(default=True)
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')

    class Meta:
        db_table = 'tip_equip_proy'
        permissions = [
            ("list_tipoequipo", "Can list tipos equipos"),
        ]


class TipoEquipoDocumento(models.Model):
    def documento_upload_to(instance, filename):
        ahora = timezone.datetime.now()
        return "documentos/tipos_equipos/%s/%s%s%s%s%s" % (
            instance.tipo_equipo.id, ahora.year, ahora.month, ahora.day, ahora.microsecond, filename)

    tipo_equipo = models.ForeignKey(TipoEquipo, related_name='documentos', on_delete=models.PROTECT,
                                    db_column='tip_equ')
    nombre_archivo = models.CharField(max_length=120, db_column='nombre')
    archivo = models.FileField(upload_to=documento_upload_to, db_column='file')
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')

    class Meta:
        db_table = 'tip_equip_docs'
        permissions = [
            ("list_tipoequipodocumento", "Can list documentos tipo equipo"),
        ]


class EquipoProyecto(models.Model):
    nro_identificacion = models.BigIntegerField(unique=True, db_column='nro_id')
    fecha_entrega = models.DateField(null=True, db_column='fec_entre')
    literal = models.ForeignKey(Literal, related_name='equipos', on_delete=models.PROTECT)
    nombre = models.CharField(max_length=200)
    tipo_equipo = models.ForeignKey(TipoEquipo, related_name='equipos', on_delete=models.PROTECT, db_column='tip_equ')
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')

    class Meta:
        db_table = 'equip_proy'
        permissions = [
            ("list_equipoproyecto", "Can list equipos proyectos"),
        ]
