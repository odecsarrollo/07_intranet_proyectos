# Generated by Django 2.2 on 2019-08-02 03:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0014_auto_20190801_2204'),
    ]

    operations = [
        migrations.AddField(
            model_name='bandaeurobelt',
            name='material',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, related_name='bandas', to='bandas_eurobelt.MaterialBandaEurobelt'),
            preserve_default=False,
        ),
    ]
