# Generated by Django 2.2.6 on 2020-02-11 17:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('proyectos', '0063_auto_20191218_1407'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proyecto',
            name='cliente',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='proyectos', to='clientes.ClienteBiable'),
        ),
    ]