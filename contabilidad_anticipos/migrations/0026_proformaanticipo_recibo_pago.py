# Generated by Django 2.2.6 on 2019-12-04 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contabilidad_anticipos', '0025_auto_20191203_2029'),
    ]

    operations = [
        migrations.AddField(
            model_name='proformaanticipo',
            name='recibo_pago',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
