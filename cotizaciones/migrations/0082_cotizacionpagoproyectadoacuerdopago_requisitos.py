# Generated by Django 2.2.6 on 2020-08-13 20:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0081_cotizacion_cotizacion_archivo'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacionpagoproyectadoacuerdopago',
            name='requisitos',
            field=models.TextField(null=True),
        ),
    ]