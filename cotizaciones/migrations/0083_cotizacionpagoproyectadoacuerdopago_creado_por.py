# Generated by Django 2.2.6 on 2020-08-13 23:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('cotizaciones', '0082_cotizacionpagoproyectadoacuerdopago_requisitos'),
    ]

    operations = [
        migrations.AddField(
            model_name='cotizacionpagoproyectadoacuerdopago',
            name='creado_por',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
