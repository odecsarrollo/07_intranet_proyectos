# Generated by Django 2.2 on 2019-06-10 16:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos_seguimientos', '0021_fase_es_para_compras'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='faseliteral',
            options={'permissions': [('list_faseliteral', 'Can see list fases literales')]},
        ),
    ]