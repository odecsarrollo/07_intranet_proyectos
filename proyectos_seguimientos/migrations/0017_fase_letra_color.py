# Generated by Django 2.1.4 on 2019-01-11 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos_seguimientos', '0016_fase_color'),
    ]

    operations = [
        migrations.AddField(
            model_name='fase',
            name='letra_color',
            field=models.CharField(default='', max_length=10),
        ),
    ]