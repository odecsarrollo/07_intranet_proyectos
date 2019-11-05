# Generated by Django 2.2.6 on 2019-11-05 21:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones', '0042_auto_20191019_0954'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='cotizacion',
            options={'permissions': [['list_cotizaciones_abrir_carpeta', 'Puede listar cotizaciones para abrir carpeta'], ['rel_cotizacion_adicional_a_literal', 'Puede relacionar cotizacion adicional a literal'], ['rel_cotizacion_proyecto', 'Puede relacionar cotizacion a proyecto'], ['list_cotizacion', 'Puede listar cotizaciones'], ['detail_cotizacion', 'Puede ver detalle cotizacion'], ['gestionar_cotizacion', 'Puede gestionar cotizacion'], ['list_all_cotizacion', 'Puede listar todas las cotizaciones'], ['list_all_cotizaciones_activas', 'Puede listar todas las cotizaciones activas'], ['list_tuberia_ventas', 'Puede ver la tuberia de bentas'], ['list_tuberia_informe_uno', 'Puede Ver informe de tuberia de ventas']]},
        ),
    ]
