# Generated by Django 2.2 on 2019-08-02 01:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bandas_eurobelt', '0012_auto_20190801_1806'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bandaeurobelt',
            options={'permissions': [('list_bandaeurobelt', 'Can see list bandas eurobelt')]},
        ),
    ]
