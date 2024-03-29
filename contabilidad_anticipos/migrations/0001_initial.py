# Generated by Django 2.2 on 2019-05-29 20:47

import contabilidad_anticipos.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('cargues_catalogos', '0011_auto_20190415_1106'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProformaAnticipo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('nro_consecutivo', models.IntegerField()),
                ('informacion_locatario', models.TextField(null=True)),
                ('informacion_cliente', models.TextField(null=True)),
                ('divisa', models.CharField(choices=[('USD', 'Dólares'), ('EUR', 'Euros')], max_length=10)),
                ('tipo_documento', models.CharField(choices=[('PROFORMA', 'Proforma'), ('CUENTA_COBRO', 'Cuenta de Cobro')], max_length=10)),
                ('nit', models.CharField(max_length=20)),
                ('nombre_cliente', models.CharField(max_length=200)),
                ('fecha', models.DateField()),
                ('nro_orden_cobro', models.CharField(max_length=20)),
                ('condicion_pago', models.CharField(max_length=200)),
                ('cliente', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='cobros_anticipos', to='cargues_catalogos.ClienteCatalogo')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ProformaConfiguracion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('informacion_odecopack', models.TextField()),
                ('informacion_bancaria', models.TextField()),
                ('firma', models.FileField(null=True, upload_to=contabilidad_anticipos.models.ProformaConfiguracion.firma_upload_to)),
                ('encabezado', models.FileField(null=True, upload_to=contabilidad_anticipos.models.ProformaConfiguracion.encabezado_upload_to)),
            ],
        ),
        migrations.CreateModel(
            name='ProformaAnticipoItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('descripcion', models.CharField(max_length=300)),
                ('cantidad', models.DecimalField(decimal_places=2, max_digits=12)),
                ('valor_unitario', models.DecimalField(decimal_places=2, max_digits=12)),
                ('proforma_anticipo', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='items', to='contabilidad_anticipos.ProformaAnticipo')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
