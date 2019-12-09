# Generated by Django 2.2.6 on 2019-12-09 16:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('permisos', '0008_auto_20190808_1805'),
    ]

    operations = [
        migrations.CreateModel(
            name='MenuProyectosPermission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'permissions': (('menu_proyectos_mano_obra', 'Menu Proyectos Mano Obra'), ('menu_proyectos_consultas', 'Menu Proyectos Consultas'), ('menu_proyectos_proyectos', 'Menu Proyectos Proyectos'), ('menu_proyectos_fases', 'Menu Proyectos Fases')),
                'managed': False,
            },
        ),
    ]
