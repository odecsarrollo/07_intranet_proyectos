# Generated by Django 2.0.4 on 2018-10-11 16:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos', '0043_remove_miembroliteral_puede_ver'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='proyecto',
            options={'permissions': [('list_proyecto', 'Can see list proyectos'), ('detail_proyecto', 'Can see detail proyecto'), ('valor_proyecto', 'Ver valor proyecto'), ('costo_proyecto', 'Ver costo proyecto'), ('costo_mano_obra_proyecto', 'Ver costo MO proyecto'), ('costo_materiales_proyecto', 'Ver costo materiales proyecto'), ('costo_presupuestado_proyecto', 'Ver costo presupuestado proyecto'), ('admon_proyecto_project_manager', 'Administrador Project Manager'), ('detail_proyecto_project_manager', 'Ver Project Manager')], 'verbose_name': 'Proyecto', 'verbose_name_plural': 'Proyectos'},
        ),
    ]
