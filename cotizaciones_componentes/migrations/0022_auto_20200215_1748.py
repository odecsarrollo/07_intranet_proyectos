# Generated by Django 2.2.6 on 2020-02-15 22:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones_componentes', '0021_auto_20200215_1600'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemcotizacioncomponente',
            name='descripcion',
            field=models.CharField(max_length=400, null=True),
        ),
        migrations.AlterField(
            model_name='itemcotizacioncomponente',
            name='referencia',
            field=models.CharField(max_length=150, null=True),
        ),
    ]
