# Generated by Django 2.2.6 on 2020-01-30 16:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('colaboradores', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='colaborador',
            name='activo',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='colaborador',
            name='es_vendedor',
            field=models.BooleanField(default=False),
        ),
    ]
