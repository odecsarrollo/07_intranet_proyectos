# Generated by Django 2.2.6 on 2019-10-19 14:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos', '0052_auto_20190920_1745'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='proyecto',
            options={'permissions': [('list_proyecto', 'Can see list proyectos'), ('detail_proyecto', 'Can see detail proyecto'), ('valor_proyecto', 'Ver valor proyecto'), ('costo_proyecto', 'Ver costo proyecto'), ('costo_mano_obra_proyecto', 'Ver costo MO proyecto'), ('costo_materiales_proyecto', 'Ver costo materiales proyecto'), ('costo_presupuestado_proyecto', 'Ver costo presupuestado proyecto'), ('admon_proyecto_project_manager', 'Administrador Project Manager'), ('detail_proyecto_project_manager', 'Ver Project Manager')]},
        ),
    ]