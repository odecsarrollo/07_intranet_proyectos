# Generated by Django 2.2.6 on 2020-03-10 16:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cargues_catalogos', '0036_auto_20200225_1738'),
    ]

    operations = [
        migrations.CreateModel(
            name='UnidadMedidaCatalogo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.CharField(max_length=100)),
                ('nomenclatura', models.CharField(max_length=100)),
                ('decimales', models.PositiveIntegerField(default=0)),
            ],
        ),
    ]