# Generated by Django 2.2.6 on 2020-02-24 23:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_detalles', '0010_auto_20200224_1455'),
    ]

    operations = [
        migrations.AddField(
            model_name='itemsliteraldetalle',
            name='estado',
            field=models.IntegerField(default=3),
        ),
    ]