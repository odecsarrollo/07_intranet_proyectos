# Generated by Django 2.2 on 2019-08-21 16:42

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('envios_emails', '0002_cobroenvio'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cotizacioncomponenteenvio',
            name='version',
        ),
        migrations.AlterField(
            model_name='cotizacioncomponenteenvio',
            name='archivo',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='envios_emails', to='cotizaciones_componentes.CotizacionComponenteDocumento'),
            preserve_default=False,
        ),
    ]
