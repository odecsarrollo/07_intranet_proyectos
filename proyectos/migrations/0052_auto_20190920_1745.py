# Generated by Django 2.2 on 2019-09-20 22:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0037_auto_20190626_1642'),
        ('proyectos', '0051_remove_literal_cotizacion'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='proyecto',
            name='cotizacion',
        ),
        migrations.AddField(
            model_name='proyecto',
            name='cotizaciones',
            field=models.ManyToManyField(related_name='proyectos', to='cotizaciones.Cotizacion'),
        ),
    ]
