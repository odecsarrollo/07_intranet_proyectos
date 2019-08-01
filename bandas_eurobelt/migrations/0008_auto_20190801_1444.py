# Generated by Django 2.2 on 2019-08-01 19:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('importaciones', '0002_auto_20190416_1051'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('items', '0003_auto_20190515_0755'),
        ('bandas_eurobelt', '0007_componentebandaeurobelt_categoria'),
    ]

    operations = [
        migrations.CreateModel(
            name='BandaEurobelt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ancho', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('largo', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('con_torneado_varilla', models.BooleanField(default=False)),
                ('empujador_alto', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('empujador_ancho', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('empujador_distanciado', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('empujador_identacion', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('empujador_filas_entre_empujador', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('empujador_filas_empujador', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('aleta_alto', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('aleta_identacion', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('color', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='bandas', to='bandas_eurobelt.ColorBandaEurobelt')),
            ],
        ),
        migrations.CreateModel(
            name='BandaEurobeltCostoEnsamblado',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('con_aleta', models.BooleanField(default=False)),
                ('con_empujador', models.BooleanField(default=False)),
                ('con_torneado', models.BooleanField(default=False)),
                ('porcentaje', models.DecimalField(decimal_places=2, max_digits=5)),
            ],
            options={
                'unique_together': {('con_aleta', 'con_empujador', 'con_torneado')},
            },
        ),
        migrations.CreateModel(
            name='ConfiguracionBandaEurobelt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('categoria_aleta', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_aleta', to='items.CategoriaProducto')),
                ('categoria_banda', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_banda', to='items.CategoriaProducto')),
                ('categoria_empujador', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_empujador', to='items.CategoriaProducto')),
                ('categoria_modulo', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_modulo', to='items.CategoriaProducto')),
                ('categoria_tapa', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_tapa', to='items.CategoriaProducto')),
                ('categoria_varilla', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='configuracion_banda_eurobelt_varilla', to='items.CategoriaProducto')),
                ('fabricante', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='importaciones.ProveedorImportacion')),
            ],
        ),
        migrations.CreateModel(
            name='EnsambladoBandaEurobelt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('cortado_a', models.CharField(default='COMPLETA', max_length=10)),
                ('cantidad', models.PositiveIntegerField()),
                ('banda', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bandas_eurobelt.BandaEurobelt')),
                ('componente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bandas_eurobelt.ComponenteBandaEurobelt')),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='ensamblado_created_by', to=settings.AUTH_USER_MODEL)),
                ('updated_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='ensamblado_updated_by', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.DeleteModel(
            name='ConfiguracionNombreAutomatico',
        ),
        migrations.AddField(
            model_name='bandaeurobelt',
            name='costo_ensamblado',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='bandas_eurobelt.BandaEurobeltCostoEnsamblado'),
        ),
        migrations.AddField(
            model_name='bandaeurobelt',
            name='empujador_tipo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='bandas_con_empujadores', to='bandas_eurobelt.TipoBandaBandaEurobelt'),
        ),
        migrations.AddField(
            model_name='bandaeurobelt',
            name='ensamblado',
            field=models.ManyToManyField(through='bandas_eurobelt.EnsambladoBandaEurobelt', to='bandas_eurobelt.ComponenteBandaEurobelt'),
        ),
        migrations.AddField(
            model_name='bandaeurobelt',
            name='serie',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='bandas', to='bandas_eurobelt.SerieBandaEurobelt'),
        ),
    ]
