# Generated by Django 2.2.6 on 2020-03-16 01:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cotizaciones_componentes', '0031_itemcotizacioncomponente_verificacion_solicitada_fecha'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemcotizacioncomponente',
            name='verificacion_solicitada_usuario',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='cotizacion_componentes_items_verificaciones_solicitadas', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='itemcotizacioncomponente',
            name='verifico_usuario',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='cotizacion_componentes_items_verificados', to=settings.AUTH_USER_MODEL),
        ),
    ]