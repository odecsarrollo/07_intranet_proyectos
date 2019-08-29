# Generated by Django 2.2 on 2019-08-28 16:26

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones_componentes', '0015_cotizacioncomponente_razon_rechazo'),
    ]

    operations = [
        migrations.CreateModel(
            name='CotizacionComponenteSeguimiento',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('tipo_seguimiento', models.CharField(choices=[('TEL', 'Llamada'), ('VIS', 'Visíta'), ('COM', 'Comentario'), ('EST', 'Cambio Estado'), ('ENV', 'Envio Correo')], max_length=3)),
                ('descripcion', models.TextField()),
                ('fecha', models.DateTimeField()),
                ('cotizacion_componente', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='seguimiento', to='cotizaciones_componentes.CotizacionComponente')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
