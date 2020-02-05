# Generated by Django 2.2.6 on 2020-02-05 23:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sistema_informacion_origen', '0004_auto_20190610_1453'),
        ('cargues_detalles', '0003_auto_20190415_1211'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movimientoventadetalle',
            name='nro_documento',
        ),
        migrations.RemoveField(
            model_name='movimientoventadetalle',
            name='sistema_informacion',
        ),
        migrations.RemoveField(
            model_name='movimientoventadetalle',
            name='tipo_documento',
        ),
        migrations.AddField(
            model_name='facturadetalle',
            name='documento_id',
            field=models.BigIntegerField(db_index=True, null=True),
        ),
        migrations.AlterField(
            model_name='facturadetalle',
            name='cliente',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='compras_componentes', to='clientes.ClienteBiable'),
        ),
        migrations.AlterField(
            model_name='facturadetalle',
            name='colaborador',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='ventas_componentes', to='colaboradores.Colaborador'),
        ),
        migrations.AlterUniqueTogether(
            name='facturadetalle',
            unique_together={('sistema_informacion', 'tipo_documento', 'nro_documento')},
        ),
    ]
