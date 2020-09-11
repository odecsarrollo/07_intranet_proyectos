from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class DocumentacionArea(models.Model):
    nombre = models.CharField(max_length=200)
    lider = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True)

    class Meta:
        db_table = 'doct_area'


class DocumentacionProceso(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField()

    class Meta:
        db_table = 'doct_proc'


class DocumentacionProcesoResponsable(models.Model):
    proceso = models.ForeignKey(
        DocumentacionProceso,
        related_name='responsables',
        on_delete=models.PROTECT
    )
    responsable = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True)
    email = models.EmailField(null=True)
    extencion = models.PositiveIntegerField(null=True, db_column='ext')

    class Meta:
        db_table = 'doct_proc_resp'


def documento_proceso_upload_to(instance, filename):
    fecha = timezone.datetime.now()
    return "documentacion/documento_proceso_%s%s%s%s%s%s.%s" % (
        fecha.year, fecha.month, fecha.day, fecha.hour, fecha.minute, fecha.second, filename.split('.')[-1])


class DocumentacionProcesoDocumento(models.Model):
    proceso = models.ForeignKey(
        DocumentacionProceso,
        related_name='documentos',
        on_delete=models.PROTECT
    )
    nombre_archivo = models.CharField(max_length=120, db_column='nombre')
    descripcion = models.TextField(db_column='desc')
    documento = models.FileField(upload_to=documento_proceso_upload_to, db_column='file')
    creado_por = models.ForeignKey(User, on_delete=models.PROTECT, blank=True, null=True, db_column='crt_by')

    class Meta:
        db_table = 'doct_proc_docts'
