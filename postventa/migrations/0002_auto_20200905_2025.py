# Generated by Django 2.2.6 on 2020-09-06 01:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos_equipos', '0012_auto_20200905_1011'),
        ('postventa', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='postventarutinatipoequipo',
            name='tipo_equipo_clase',
            field=models.ForeignKey(db_column='tip_equ_cla', null=True, on_delete=django.db.models.deletion.PROTECT, related_name='rutinas_postventa', to='proyectos_equipos.TipoEquipoClase'),
        ),
        migrations.AlterField(
            model_name='postventarutinatipoequipo',
            name='tipo_equipo',
            field=models.ForeignKey(db_column='tip_equ', null=True, on_delete=django.db.models.deletion.PROTECT, related_name='rutinas_postventa', to='proyectos_equipos.TipoEquipo'),
        ),
    ]
