# Generated by Django 2.2 on 2019-07-15 17:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contabilidad_anticipos', '0021_auto_20190711_1217'),
    ]

    operations = [
        migrations.AddField(
            model_name='proformaconfiguracion',
            name='email_from_default',
            field=models.EmailField(max_length=254, null=True),
        ),
    ]
