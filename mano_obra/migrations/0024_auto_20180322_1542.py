# Generated by Django 2.0.1 on 2018-03-22 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mano_obra', '0023_auto_20180316_1829'),
    ]

    operations = [
        migrations.AddField(
            model_name='horahojatrabajo',
            name='descripcion_tarea',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='horahojatrabajo',
            name='verificado',
            field=models.BooleanField(default=False),
        ),
    ]