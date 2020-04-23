# Generated by Django 2.2.6 on 2020-04-15 19:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0046_itemscatalogo_marca'),
        ('cargues_detalles', '0015_auto_20200415_0913'),
    ]

    operations = [
        migrations.AddField(
            model_name='movimientoventadetalle',
            name='unidad_medida',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='ventas', to='cargues_catalogos.UnidadMedidaCatalogo'),
        ),
    ]