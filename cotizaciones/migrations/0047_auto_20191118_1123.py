# Generated by Django 2.2.6 on 2019-11-18 16:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0046_condicioninicioproyecto_condicioninicioproyectocotizacion'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='condicioninicioproyecto',
            options={'permissions': [('list_condicioninicioproyecto', 'Can list condiciones inicio cotizaciones')]},
        ),
    ]
