# Generated by Django 2.0.4 on 2019-04-16 15:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('importaciones', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='margenprovedor',
            options={'permissions': [['list_margenprovedor', 'Puede listar margenes x proveedores']]},
        ),
        migrations.AlterModelOptions(
            name='monedacambio',
            options={'permissions': [['list_monedacambio', 'Puede listar monedas cambio']]},
        ),
        migrations.AlterModelOptions(
            name='proveedorimportacion',
            options={'permissions': [['list_proveedorimportacion', 'Puede listar proveedores importaciones']]},
        ),
    ]
