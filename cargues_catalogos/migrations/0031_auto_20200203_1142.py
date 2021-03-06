# Generated by Django 2.2.6 on 2020-02-03 16:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0030_auto_20200130_1231'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sucursalcatalogo',
            name='colaborador',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='sucursales_sistema_informacion', to='colaboradores.Colaborador'),
        ),
        migrations.AlterField(
            model_name='sucursalcatalogo',
            name='colaborador_real',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='sucursales_asignadas', to='colaboradores.Colaborador'),
        ),
    ]
