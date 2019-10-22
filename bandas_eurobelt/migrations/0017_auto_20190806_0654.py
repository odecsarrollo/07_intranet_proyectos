# Generated by Django 2.2 on 2019-08-06 11:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0016_bandaeurobelt_tipo'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bandaeurobelt',
            old_name='ensamblado',
            new_name='componentes',
        ),
        migrations.AlterField(
            model_name='ensambladobandaeurobelt',
            name='banda',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ensamblado', to='bandas_eurobelt.BandaEurobelt'),
        ),
        migrations.AlterField(
            model_name='ensambladobandaeurobelt',
            name='componente',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bandas', to='bandas_eurobelt.ComponenteBandaEurobelt'),
        ),
    ]