# Generated by Django 2.2.6 on 2020-07-29 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0075_auto_20200729_1345'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacionpagoproyectadoacuerdopago',
            name='motivo',
            field=models.CharField(default='Falloooo', max_length=100),
            preserve_default=False,
        ),
    ]