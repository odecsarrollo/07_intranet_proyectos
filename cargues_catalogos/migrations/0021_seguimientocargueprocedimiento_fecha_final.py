# Generated by Django 2.2.6 on 2020-01-28 15:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0020_auto_20200128_1018'),
    ]

    operations = [
        migrations.AddField(
            model_name='seguimientocargueprocedimiento',
            name='fecha_final',
            field=models.DateTimeField(null=True),
        ),
    ]