# Generated by Django 2.2.6 on 2019-12-18 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos', '0059_auto_20191216_2110'),
    ]

    operations = [
        migrations.AddField(
            model_name='proyecto',
            name='cotizacion_componentes_nro_cotizacion',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='proyecto',
            name='cotizacion_componentes_precio_venta',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
    ]
