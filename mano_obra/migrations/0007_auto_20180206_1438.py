# Generated by Django 2.0.1 on 2018-02-06 14:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mano_obra', '0006_auto_20180206_1251'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='hojatrabajodiario',
            options={'permissions': [('list_hojatrabajodiario', 'Can see list hoja trabajo diario'), ('detail_hojatrabajodiario', 'Can see detail hoja trabajo diario')]},
        ),
    ]