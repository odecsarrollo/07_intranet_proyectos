# Generated by Django 2.2 on 2019-08-09 16:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0015_auto_20190611_1256'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='clientebiable',
            name='sistema_informacion',
        ),
        migrations.AddField(
            model_name='clientebiable',
            name='canal',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='empresas', to='clientes.CanalDistribucion'),
        ),
        migrations.AddField(
            model_name='clientebiable',
            name='cliente_nuevo_nit',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='cliente_viejo_nit', to='clientes.ClienteBiable'),
        ),
        migrations.AddField(
            model_name='clientebiable',
            name='es_competencia',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='clientebiable',
            name='fecha_creacion',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='clientebiable',
            name='forma_pago',
            field=models.CharField(max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='clientebiable',
            name='grupo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='empresas', to='clientes.GrupoCliente'),
        ),
        migrations.AddField(
            model_name='clientebiable',
            name='industria',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='empresas', to='clientes.TipoIndustria'),
        ),
    ]
