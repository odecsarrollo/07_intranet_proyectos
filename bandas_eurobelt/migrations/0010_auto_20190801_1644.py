# Generated by Django 2.2 on 2019-08-01 21:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0009_auto_20190801_1545'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bandaeurobeltcostoensamblado',
            name='porcentaje',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=5),
        ),
    ]
