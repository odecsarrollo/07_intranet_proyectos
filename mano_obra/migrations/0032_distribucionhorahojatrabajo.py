# Generated by Django 2.2.6 on 2019-12-26 15:19

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos', '0063_auto_20191218_1407'),
        ('mano_obra', '0031_auto_20190612_1200'),
    ]

    operations = [
        migrations.CreateModel(
            name='DistribucionHoraHojaTrabajo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('verificado', models.BooleanField(default=False)),
                ('am2430_am0100', models.BooleanField(default=False)),
                ('am0100_am0130', models.BooleanField(default=False)),
                ('am0130_am0200', models.BooleanField(default=False)),
                ('am0200_am0230', models.BooleanField(default=False)),
                ('am0230_am0300', models.BooleanField(default=False)),
                ('am0300_am0330', models.BooleanField(default=False)),
                ('am0330_am0400', models.BooleanField(default=False)),
                ('am0400_am0430', models.BooleanField(default=False)),
                ('am0430_am0500', models.BooleanField(default=False)),
                ('am0500_am0530', models.BooleanField(default=False)),
                ('am0530_am0600', models.BooleanField(default=False)),
                ('am0600_am0630', models.BooleanField(default=False)),
                ('am0630_am0700', models.BooleanField(default=False)),
                ('am0700_am0730', models.BooleanField(default=False)),
                ('am0730_am0800', models.BooleanField(default=False)),
                ('am0800_am0830', models.BooleanField(default=False)),
                ('am0830_am0900', models.BooleanField(default=False)),
                ('am0900_am0930', models.BooleanField(default=False)),
                ('am0930_am1000', models.BooleanField(default=False)),
                ('am1000_am1030', models.BooleanField(default=False)),
                ('am1030_am1100', models.BooleanField(default=False)),
                ('am1100_am1130', models.BooleanField(default=False)),
                ('am1130_pm1200', models.BooleanField(default=False)),
                ('pm1200_pm1230', models.BooleanField(default=False)),
                ('pm1230_pm1300', models.BooleanField(default=False)),
                ('pm1300_pm1330', models.BooleanField(default=False)),
                ('pm1330_pm1400', models.BooleanField(default=False)),
                ('pm1400_pm1430', models.BooleanField(default=False)),
                ('pm1430_pm1500', models.BooleanField(default=False)),
                ('pm1500_pm1530', models.BooleanField(default=False)),
                ('pm1530_pm1600', models.BooleanField(default=False)),
                ('pm1600_pm1630', models.BooleanField(default=False)),
                ('pm1630_pm1700', models.BooleanField(default=False)),
                ('pm1700_pm1730', models.BooleanField(default=False)),
                ('pm1730_pm1800', models.BooleanField(default=False)),
                ('pm1800_pm1830', models.BooleanField(default=False)),
                ('pm1830_pm1900', models.BooleanField(default=False)),
                ('pm1900_pm1930', models.BooleanField(default=False)),
                ('pm1930_pm2000', models.BooleanField(default=False)),
                ('pm2000_pm2030', models.BooleanField(default=False)),
                ('pm2030_pm2100', models.BooleanField(default=False)),
                ('pm2100_pm2130', models.BooleanField(default=False)),
                ('pm2130_pm2200', models.BooleanField(default=False)),
                ('pm2200_pm2230', models.BooleanField(default=False)),
                ('pm2230_pm2300', models.BooleanField(default=False)),
                ('pm2300_pm2330', models.BooleanField(default=False)),
                ('pm2330_am2400', models.BooleanField(default=False)),
                ('am2400_am2430', models.BooleanField(default=False)),
                ('hoja', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='mis_horas_trabajadas_distribuidas', to='mano_obra.HojaTrabajoDiario')),
                ('literal', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='mis_horas_trabajadas_distribuidas', to='proyectos.Literal')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
