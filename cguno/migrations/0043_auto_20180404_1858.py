# Generated by Django 2.0.1 on 2018-04-04 18:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cguno', '0042_colaboradorcostomesbiable_nro_horas_mes_trabajadas'),
    ]

    operations = [
        migrations.AddField(
            model_name='colaboradorbiable',
            name='es_aprendiz_sena',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='colaboradorbiable',
            name='porcentaje_salud',
            field=models.DecimalField(decimal_places=4, default=2.436, max_digits=10),
        ),
    ]
