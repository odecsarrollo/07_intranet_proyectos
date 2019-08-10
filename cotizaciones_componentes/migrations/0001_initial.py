# Generated by Django 2.2 on 2019-08-10 00:15

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('geografia', '0003_auto_20190809_1223'),
        ('clientes', '0017_auto_20190809_1758'),
    ]

    operations = [
        migrations.CreateModel(
            name='CotizacionComponente',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('estado', models.CharField(choices=[('INI', 'Iniciado'), ('ENV', 'Enviada'), ('REC', 'Recibida'), ('PRO', 'En Proceso'), ('FIN', 'Entragada Totalmente'), ('ELI', 'Rechazada')], default='INI', max_length=10)),
                ('version', models.PositiveIntegerField(default=1)),
                ('ciudad', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='cotizaciones', to='geografia.Ciudad')),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='cotizaciones', to='clientes.ClienteBiable')),
                ('contacto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='cotizaciones', to='clientes.ContactoCliente')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
