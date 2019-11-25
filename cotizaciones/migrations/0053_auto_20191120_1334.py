# Generated by Django 2.2.6 on 2019-11-20 18:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0052_cotizacion_listo_para_iniciar'),
    ]

    operations = [
        migrations.AddField(
            model_name='condicioninicioproyectocotizacion',
            name='condicion_inicio_proyecto',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='condiciones_inicio_cotizacion', to='cotizaciones.CondicionInicioProyecto'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='condicioninicioproyectocotizacion',
            name='cotizacion_proyecto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='condiciones_inicio_cotizacion', to='cotizaciones.Cotizacion'),
        ),
    ]
