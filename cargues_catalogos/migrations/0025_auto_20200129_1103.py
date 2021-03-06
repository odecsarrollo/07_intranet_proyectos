# Generated by Django 2.2.6 on 2020-01-29 16:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0024_clientecatalogo_id_tercero'),
    ]

    operations = [
        migrations.RenameField(
            model_name='clientecatalogo',
            old_name='cliente_contacto',
            new_name='cliente',
        ),
        migrations.RenameField(
            model_name='clientecatalogo',
            old_name='id_tercero',
            new_name='tercero_id',
        ),
        migrations.AddField(
            model_name='colaboradorcatalogo',
            name='tercero_id',
            field=models.BigIntegerField(null=True),
        ),
    ]
