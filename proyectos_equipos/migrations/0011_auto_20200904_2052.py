# Generated by Django 2.2.6 on 2020-09-05 01:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos_equipos', '0010_tipoequipocampo_obligatorio'),
    ]

    operations = [
        migrations.AddField(
            model_name='tipoequipocampo',
            name='tipo_equipo_clase',
            field=models.ForeignKey(db_column='tip_equ_cla', null=True, on_delete=django.db.models.deletion.PROTECT, related_name='campos', to='proyectos_equipos.TipoEquipoClase'),
        ),
        migrations.AlterField(
            model_name='tipoequipocampo',
            name='tipo_equipo',
            field=models.ForeignKey(db_column='tip_equ', null=True, on_delete=django.db.models.deletion.PROTECT, related_name='campos', to='proyectos_equipos.TipoEquipo'),
        ),
    ]
