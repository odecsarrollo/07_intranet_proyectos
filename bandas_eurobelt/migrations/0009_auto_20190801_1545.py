# Generated by Django 2.2 on 2019-08-01 20:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0008_auto_20190801_1444'),
    ]

    operations = [
        migrations.AlterField(
            model_name='configuracionbandaeurobelt',
            name='categoria_aleta',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_aleta', to='items.CategoriaProducto'),
        ),
        migrations.AlterField(
            model_name='configuracionbandaeurobelt',
            name='categoria_banda',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_banda', to='items.CategoriaProducto'),
        ),
        migrations.AlterField(
            model_name='configuracionbandaeurobelt',
            name='categoria_empujador',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_empujador', to='items.CategoriaProducto'),
        ),
        migrations.AlterField(
            model_name='configuracionbandaeurobelt',
            name='categoria_modulo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_modulo', to='items.CategoriaProducto'),
        ),
        migrations.AlterField(
            model_name='configuracionbandaeurobelt',
            name='categoria_tapa',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_tapa', to='items.CategoriaProducto'),
        ),
        migrations.AlterField(
            model_name='configuracionbandaeurobelt',
            name='categoria_varilla',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_varilla', to='items.CategoriaProducto'),
        ),
        migrations.AlterField(
            model_name='configuracionbandaeurobelt',
            name='fabricante',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='importaciones.ProveedorImportacion'),
        ),
    ]
