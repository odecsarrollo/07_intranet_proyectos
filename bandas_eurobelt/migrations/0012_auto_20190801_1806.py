# Generated by Django 2.2 on 2019-08-01 23:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0011_componentebandaeurobelt_margen'),
    ]

    operations = [
        migrations.RenameField(
            model_name='componentebandaeurobelt',
            old_name='diametro_varilla',
            new_name='diametro',
        ),
    ]
