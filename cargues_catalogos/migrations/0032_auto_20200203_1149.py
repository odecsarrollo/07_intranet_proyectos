# Generated by Django 2.2.6 on 2020-02-03 16:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0031_auto_20200203_1142'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sucursalcatalogo',
            name='cliente',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='sucursales', to='clientes.ClienteBiable'),
        ),
    ]
