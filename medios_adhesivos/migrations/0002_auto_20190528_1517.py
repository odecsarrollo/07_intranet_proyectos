# Generated by Django 2.0.4 on 2019-05-28 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('medios_adhesivos', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='adhesivo',
            name='sticker',
        ),
        migrations.AddField(
            model_name='adhesivo',
            name='tipo',
            field=models.IntegerField(choices=[(1, 'Etiqueta'), (2, 'Sticker')], default=1),
            preserve_default=False,
        ),
    ]
