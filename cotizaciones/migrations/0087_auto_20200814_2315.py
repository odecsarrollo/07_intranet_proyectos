# Generated by Django 2.2.6 on 2020-08-15 04:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0086_archivocotizacion_orden_compra'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cotizacion',
            name='cotizacion_archivo',
        ),
        migrations.RemoveField(
            model_name='cotizacion',
            name='orden_compra_archivo',
        ),
        migrations.RemoveField(
            model_name='cotizacion',
            name='orden_compra_fecha',
        ),
        migrations.RemoveField(
            model_name='cotizacion',
            name='orden_compra_nro',
        ),
        migrations.RemoveField(
            model_name='cotizacion',
            name='valor_orden_compra',
        ),
    ]
