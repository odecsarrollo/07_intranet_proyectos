# Generated by Django 2.2.6 on 2020-02-14 05:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clientes', '0022_contactocliente_id_temporal_crm'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactocliente',
            name='empresa',
            field=models.CharField(max_length=120, null=True),
        ),
        migrations.AddField(
            model_name='contactocliente',
            name='planta',
            field=models.CharField(max_length=120, null=True),
        ),
    ]
