# Generated by Django 2.2.6 on 2020-02-14 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones_componentes', '0017_auto_20190828_1207'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacioncomponente',
            name='es_crm_anterior',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='itemcotizacioncomponente',
            name='transporte_tipo',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
