# Generated by Django 2.2.6 on 2019-11-20 16:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0051_remove_cotizacion_listo_para_iniciar'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacion',
            name='listo_para_iniciar',
            field=models.BooleanField(default=False),
        ),
    ]