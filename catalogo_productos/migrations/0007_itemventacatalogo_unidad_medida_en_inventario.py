# Generated by Django 2.2.6 on 2020-03-10 19:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0041_itemscatalogo_unidad_medida_en_inventario'),
        ('catalogo_productos', '0006_itemventacatalogo_fecha_ultima_entrada'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemventacatalogo',
            name='unidad_medida_en_inventario',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='cargues_catalogos.UnidadMedidaCatalogo'),
        ),
    ]
