# Generated by Django 2.2 on 2019-09-20 22:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos', '0050_auto_20190704_1050'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='literal',
            name='cotizacion',
        ),
    ]
