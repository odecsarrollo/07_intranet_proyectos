# Generated by Django 2.2 on 2019-08-01 22:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('importaciones', '0002_auto_20190416_1051'),
        ('bandas_eurobelt', '0010_auto_20190801_1644'),
    ]

    operations = [
        migrations.AddField(
            model_name='componentebandaeurobelt',
            name='margen',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='ensamblados', to='importaciones.MargenProvedor'),
        ),
    ]
