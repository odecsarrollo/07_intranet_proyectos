# Generated by Django 2.2.6 on 2020-09-09 14:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('postventa', '0006_auto_20200906_1833'),
    ]

    operations = [
        migrations.AlterField(
            model_name='postventaeventoequipo',
            name='fecha_inicio',
            field=models.DateField(db_column='fec_ini', null=True),
        ),
    ]
