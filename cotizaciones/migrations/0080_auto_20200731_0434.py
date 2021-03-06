# Generated by Django 2.2.6 on 2020-07-31 09:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cotizaciones', '0079_cotizacionpagoproyectadoacuerdopagopago_notificada_por_correo'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='cotizacionpagoproyectado',
            options={'permissions': [('list_cotizacionpagoproyectado', 'Can list pagos proyectados')]},
        ),
        migrations.AlterModelOptions(
            name='cotizacionpagoproyectadoacuerdopagopago',
            options={'permissions': [('list_cotizacionpagoproyectadoacuerdopagopago', 'Can list acuerdos de pagos pagos'), ('delete_cotizacionpagoproyectadoacuerdopagopago_siempre', 'Can delete acuerdos de pagos pagos siempre')]},
        ),
        migrations.AddField(
            model_name='cotizacionpagoproyectado',
            name='creado_por',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='pagos_proyectados_creados', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='cotizacionpagoproyectadoacuerdopagopago',
            name='creado_por',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='cotizaciones_pagos_creados', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
