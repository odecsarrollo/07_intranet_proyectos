# Generated by Django 2.2.6 on 2020-09-09 14:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('documentaciones_procesos', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='documentacionprocesoresponsable',
            name='nombre',
        ),
        migrations.AddField(
            model_name='documentacionprocesodocumento',
            name='creado_por',
            field=models.ForeignKey(blank=True, db_column='crt_by', null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='documentacionprocesodocumento',
            name='proceso',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='documentos', to='documentaciones_procesos.DocumentacionProceso'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='documentacionprocesoresponsable',
            name='responsable',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='documentacionarea',
            name='lider',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
        ),
    ]