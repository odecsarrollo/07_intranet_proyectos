# Generated by Django 2.2.6 on 2020-02-25 22:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0035_auto_20200219_1054'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientecatalogo',
            name='nit',
            field=models.CharField(db_index=True, max_length=20),
        ),
        migrations.AlterField(
            model_name='clientecatalogo',
            name='nombre',
            field=models.CharField(max_length=200),
        ),
    ]