# Generated by Django 2.2.6 on 2020-07-03 15:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sistema_informacion_origen', '0004_auto_20190610_1453'),
        ('cargues_detalles', '0019_auto_20200703_1053'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='facturadetalle',
            unique_together={('sistema_informacion', 'tipo_documento_original', 'nro_documento')},
        ),
    ]
