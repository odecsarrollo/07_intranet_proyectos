# Generated by Django 2.2 on 2019-06-04 16:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('medios_adhesivos', '0005_auto_20190604_1049'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='adhesivo',
            options={'permissions': [('list_adhesivo', 'Can list adhesivo ')]},
        ),
        migrations.AlterModelOptions(
            name='adhesivomovimiento',
            options={'permissions': [('list_adhesivomovimiento', 'Can list adhesivo movimiento ')]},
        ),
    ]
