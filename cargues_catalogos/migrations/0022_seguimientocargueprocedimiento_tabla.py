# Generated by Django 2.2.6 on 2020-01-28 19:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0021_seguimientocargueprocedimiento_fecha_final'),
    ]

    operations = [
        migrations.AddField(
            model_name='seguimientocargueprocedimiento',
            name='tabla',
            field=models.CharField(default='default', max_length=400),
        ),
    ]
