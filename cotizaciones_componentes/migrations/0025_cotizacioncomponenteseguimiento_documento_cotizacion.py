# Generated by Django 2.2.6 on 2020-02-17 00:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones_componentes', '0024_auto_20200216_1227'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacioncomponenteseguimiento',
            name='documento_cotizacion',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='seguimientos', to='cotizaciones_componentes.CotizacionComponenteDocumento'),
        ),
    ]