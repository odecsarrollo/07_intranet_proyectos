# Generated by Django 2.2 on 2019-08-10 00:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones_componentes', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='cotizacioncomponente',
            options={'permissions': [('list_cotizacioncomponente', 'Can list cotizaciones componentes')]},
        ),
    ]