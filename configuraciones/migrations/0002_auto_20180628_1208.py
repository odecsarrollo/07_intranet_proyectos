# Generated by Django 2.0.4 on 2018-06-28 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configuraciones', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='configuracioncosto',
            name='fecha_cierre',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]