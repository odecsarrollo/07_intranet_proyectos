# Generated by Django 2.2 on 2019-08-02 03:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0013_auto_20190801_2046'),
    ]

    operations = [
        migrations.AddField(
            model_name='bandaeurobelt',
            name='con_aleta',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='bandaeurobelt',
            name='con_empujador',
            field=models.BooleanField(default=False),
        ),
    ]