# Generated by Django 2.2 on 2019-08-09 22:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0016_auto_20190809_1105'),
    ]

    operations = [
        migrations.AddField(
            model_name='clientebiable',
            name='nueva_desde_cotizacion',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='contactocliente',
            name='nueva_desde_cotizacion',
            field=models.BooleanField(default=False),
        ),
    ]