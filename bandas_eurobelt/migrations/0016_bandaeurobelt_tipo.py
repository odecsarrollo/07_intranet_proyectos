# Generated by Django 2.2 on 2019-08-02 03:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0015_bandaeurobelt_material'),
    ]

    operations = [
        migrations.AddField(
            model_name='bandaeurobelt',
            name='tipo',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='bandas', to='bandas_eurobelt.TipoBandaBandaEurobelt'),
        ),
    ]
