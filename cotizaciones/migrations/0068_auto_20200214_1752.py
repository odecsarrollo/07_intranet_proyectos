# Generated by Django 2.2.6 on 2020-02-14 22:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0067_auto_20200211_1237'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cotizacion',
            name='contacto_cliente',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='cotizaciones_proyectos', to='clientes.ContactoCliente'),
        ),
    ]
