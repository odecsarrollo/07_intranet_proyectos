# Generated by Django 2.2.6 on 2020-01-30 16:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0027_auto_20200130_0939'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='colaboradorcatalogo',
            name='activo',
        ),
        migrations.RemoveField(
            model_name='colaboradorcatalogo',
            name='es_vendedor',
        ),
    ]
