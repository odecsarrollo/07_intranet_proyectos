# Generated by Django 2.0.4 on 2019-02-15 17:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos_seguimientos', '0020_fase_orden'),
    ]

    operations = [
        migrations.AddField(
            model_name='fase',
            name='es_para_compras',
            field=models.BooleanField(default=False),
        ),
    ]