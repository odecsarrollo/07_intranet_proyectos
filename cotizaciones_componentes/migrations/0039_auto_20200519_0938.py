# Generated by Django 2.2.6 on 2020-05-19 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cotizaciones_componentes', '0038_auto_20200518_0943'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cotizacioncomponenteseguimiento',
            name='tipo_seguimiento',
            field=models.CharField(choices=[('TEL', 'Llamada'), ('VIS', 'Visíta'), ('COM', 'Comentario'), ('EST', 'Cambio Estado'), ('ENV', 'Envio Correo'), ('SEG', 'Seguimiento')], max_length=3),
        ),
    ]
