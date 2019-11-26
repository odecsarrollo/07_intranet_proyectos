# Generated by Django 2.2.6 on 2019-11-25 15:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0057_remove_condicioninicioproyectocotizacion_documento_nombre'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacion',
            name='condiciones_inicio_completas',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='cotizacion',
            name='condiciones_inicio_fecha_ultima',
            field=models.DateField(null=True),
        ),
    ]
