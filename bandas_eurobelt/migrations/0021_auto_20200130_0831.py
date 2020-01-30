# Generated by Django 2.2.6 on 2020-01-30 13:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0026_auto_20200130_0723'),
        ('bandas_eurobelt', '0020_auto_20190806_1610'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='componentebandaeurobelt',
            name='item_cguno',
        ),
        migrations.AddField(
            model_name='componentebandaeurobelt',
            name='item_sistema_informacion',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='componente_banda', to='cargues_catalogos.ItemsCatalogo'),
        ),
    ]
