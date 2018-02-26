# Generated by Django 2.0.1 on 2018-02-26 17:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos', '0018_auto_20180220_0540'),
    ]

    operations = [
        migrations.AlterField(
            model_name='literal',
            name='costo_mano_obra',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=12, null=True),
        ),
        migrations.AlterField(
            model_name='literal',
            name='costo_materiales',
            field=models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=12, null=True),
        ),
    ]
