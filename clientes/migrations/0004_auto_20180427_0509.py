# Generated by Django 2.0.4 on 2018-04-27 05:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0003_auto_20180427_0507'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='clientebiable',
            name='en_cguno',
        ),
        migrations.RemoveField(
            model_name='clientebiable',
            name='fecha_creacion',
        ),
    ]
