# Generated by Django 2.2 on 2019-06-10 20:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0011_auto_20190415_1106'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='ciudadcatalogo',
            options={'permissions': [('list_ciudadcatalogo', 'Can list ciudades catalogos')]},
        ),
        migrations.AlterModelOptions(
            name='clientecatalogo',
            options={'permissions': [('list_clientecatalogo', 'Can see list clientes catalogos')]},
        ),
        migrations.AlterModelOptions(
            name='colaboradorcatalogo',
            options={'permissions': [('list_colaboradorcatalogo', 'Can see list colaboradores')]},
        ),
        migrations.AlterModelOptions(
            name='departamentocatalogo',
            options={'permissions': [('list_departamentocatalogo', 'Can list departamentos catalogos')]},
        ),
        migrations.AlterModelOptions(
            name='itemscatalogo',
            options={'permissions': [('list_itemscatalogo', 'Can see list items catalogos')]},
        ),
        migrations.AlterModelOptions(
            name='paiscatalogo',
            options={'permissions': [('list_paiscatalogo', 'Can list paises catalogos')]},
        ),
        migrations.AlterModelOptions(
            name='sucursalcatalogo',
            options={'permissions': [('list_sucursalcatalogo', 'Can see list sucursales catalogos')]},
        ),
    ]
