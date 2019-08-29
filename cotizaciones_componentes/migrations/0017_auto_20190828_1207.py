# Generated by Django 2.2 on 2019-08-28 17:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cotizaciones_componentes', '0016_cotizacioncomponenteseguimiento'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacioncomponenteseguimiento',
            name='creado_por',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='cotizaciones_componentes_seguimientos', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='cotizacioncomponenteseguimiento',
            name='cotizacion_componente',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='seguimientos', to='cotizaciones_componentes.CotizacionComponente'),
        ),
    ]
