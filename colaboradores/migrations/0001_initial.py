# Generated by Django 2.2.6 on 2020-01-30 14:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='LineaVendedor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Colaborador',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cedula', models.CharField(max_length=20, unique=True)),
                ('nombres', models.CharField(blank=True, max_length=200, null=True)),
                ('apellidos', models.CharField(blank=True, max_length=200, null=True)),
                ('porcentaje_caja_compensacion', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('porcentaje_pension', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('porcentaje_arl', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('porcentaje_salud', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('porcentaje_prestaciones_sociales', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('base_salario', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('auxilio_transporte', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('nro_horas_mes', models.PositiveIntegerField(blank=True, default=0, null=True)),
                ('es_aprendiz', models.BooleanField(default=False)),
                ('en_proyectos', models.BooleanField(default=False)),
                ('autogestion_horas_trabajadas', models.BooleanField(default=False)),
                ('es_salario_fijo', models.BooleanField(default=False)),
                ('linea', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='colaboradores.LineaVendedor')),
                ('usuario', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='mi_colaborador', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'permissions': [('list_colaborador', 'Can see list colaboradores'), ('detail_colaborador', 'Can see detail colaborador')],
            },
        ),
        migrations.CreateModel(
            name='ColaboradorCostoMes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lapso', models.DateField()),
                ('costo', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('porcentaje_caja_compensacion', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('porcentaje_pension', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('porcentaje_arl', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('porcentaje_salud', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('porcentaje_prestaciones_sociales', models.DecimalField(decimal_places=4, default=0, max_digits=10)),
                ('nro_horas_mes', models.PositiveIntegerField(default=0)),
                ('nro_horas_mes_trabajadas', models.PositiveIntegerField(default=0)),
                ('base_salario', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('auxilio_transporte', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('otro_costo', models.DecimalField(decimal_places=2, default=0, max_digits=20)),
                ('es_salario_fijo', models.BooleanField(default=False)),
                ('es_aprendiz', models.BooleanField(default=False)),
                ('modificado', models.BooleanField(default=False)),
                ('verificado', models.BooleanField(default=False)),
                ('autogestion_horas_trabajadas', models.BooleanField(default=False)),
                ('colaborador', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='costos_meses', to='colaboradores.Colaborador')),
            ],
            options={
                'permissions': [('list_colaboradorcostomes', 'Can see list colaborador costo mes')],
                'unique_together': {('lapso', 'colaborador')},
            },
        ),
    ]
