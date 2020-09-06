# Generated by Django 2.2.6 on 2020-09-04 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos_equipos', '0006_auto_20200903_2151'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tipoequipocampoequipo',
            name='opciones_list',
        ),
        migrations.AddField(
            model_name='tipoequipocampoequipo',
            name='tamano_columna',
            field=models.PositiveIntegerField(default=12, max_length=20),
        ),
        migrations.AlterField(
            model_name='tipoequipocampoequipo',
            name='tamano',
            field=models.PositiveIntegerField(),
        ),
    ]