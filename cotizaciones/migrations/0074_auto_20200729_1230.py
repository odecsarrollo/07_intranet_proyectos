# Generated by Django 2.2.6 on 2020-07-29 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0073_auto_20200729_1230'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cotizacionpagoproyectadoacuerdopago',
            name='fecha_real',
            field=models.DateField(null=True),
        ),
    ]