# Generated by Django 2.2 on 2019-05-29 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contabilidad_anticipos', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proformaconfiguracion',
            name='informacion_bancaria',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='proformaconfiguracion',
            name='informacion_odecopack',
            field=models.TextField(null=True),
        ),
    ]
