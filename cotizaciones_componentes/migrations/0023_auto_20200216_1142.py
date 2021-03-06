# Generated by Django 2.2.6 on 2020-02-16 16:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones_componentes', '0022_auto_20200215_1748'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacioncomponenteseguimiento',
            name='adjuntos',
            field=models.ManyToManyField(related_name='seguimientos', to='cotizaciones_componentes.CotizacionComponenteAdjunto'),
        ),
        migrations.AddField(
            model_name='cotizacioncomponenteseguimiento',
            name='version_envio',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='seguimientos', to='cotizaciones_componentes.CotizacionComponenteDocumento'),
        ),
    ]
