# Generated by Django 2.2.6 on 2020-07-29 18:45

import cotizaciones.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0074_auto_20200729_1230'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='cotizacionpagoproyectadoacuerdopago',
            name='fecha_real',
        ),
        migrations.RemoveField(
            model_name='cotizacionpagoproyectadoacuerdopago',
            name='valor_real',
        ),
        migrations.CreateModel(
            name='CotizacionPagoProyectadoAcuerdoPagoPago',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('fecha', models.DateField(null=True)),
                ('valor', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('comprobante_pago', models.FileField(null=True, upload_to=cotizaciones.models.CotizacionPagoProyectadoAcuerdoPagoPago.archivo_upload_to)),
                ('acuerdo_pago', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pagos', to='cotizaciones.CotizacionPagoProyectadoAcuerdoPago')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
