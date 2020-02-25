# Generated by Django 2.2.6 on 2020-02-25 16:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones_componentes', '0026_auto_20200223_0734'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemcotizacioncomponente',
            name='costo_ori',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=18),
        ),
        migrations.AddField(
            model_name='itemcotizacioncomponente',
            name='descripcion_ori',
            field=models.CharField(max_length=400, null=True),
        ),
        migrations.AddField(
            model_name='itemcotizacioncomponente',
            name='precio_unitario_ori',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=18),
        ),
        migrations.AddField(
            model_name='itemcotizacioncomponente',
            name='referencia_ori',
            field=models.CharField(max_length=150, null=True),
        ),
        migrations.AddField(
            model_name='itemcotizacioncomponente',
            name='unidad_medida_ori',
            field=models.CharField(max_length=120, null=True),
        ),
    ]
