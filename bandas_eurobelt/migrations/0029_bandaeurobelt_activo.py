# Generated by Django 2.2.6 on 2020-02-21 04:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0028_componentebandaeurobelt_activo'),
    ]

    operations = [
        migrations.AddField(
            model_name='bandaeurobelt',
            name='activo',
            field=models.BooleanField(default=True),
        ),
    ]