# Generated by Django 2.0.4 on 2018-04-25 07:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos', '0025_proyecto_orden_compra_nro'),
    ]

    operations = [
        migrations.AddField(
            model_name='literal',
            name='abierto',
            field=models.BooleanField(default=True),
        ),
    ]