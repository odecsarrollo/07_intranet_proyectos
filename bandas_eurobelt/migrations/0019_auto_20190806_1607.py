# Generated by Django 2.2 on 2019-08-06 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0018_componentebandaeurobelt_nombre'),
    ]

    operations = [
        migrations.AddField(
            model_name='bandaeurobelt',
            name='nombre',
            field=models.CharField(max_length=300, null=True),
        ),
        migrations.AddField(
            model_name='bandaeurobelt',
            name='referencia',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
