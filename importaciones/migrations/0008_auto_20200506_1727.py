# Generated by Django 2.2.6 on 2020-05-06 22:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('importaciones', '0007_auto_20200506_1719'),
    ]

    operations = [
        migrations.AlterField(
            model_name='monedacambio',
            name='variacion',
            field=models.DecimalField(decimal_places=4, default=0, max_digits=6),
        ),
        migrations.AlterField(
            model_name='monedacambio',
            name='variacion_usd',
            field=models.DecimalField(decimal_places=4, default=0, max_digits=6),
        ),
    ]
