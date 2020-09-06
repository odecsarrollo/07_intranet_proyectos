# Generated by Django 2.2.6 on 2020-08-27 11:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import proyectos_equipos.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('proyectos', '0065_auto_20200226_0645'),
    ]

    operations = [
        migrations.CreateModel(
            name='TipoEquipo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=120)),
                ('activo', models.BooleanField(default=True)),
                ('creado_por', models.ForeignKey(blank=True, db_column='crt_by', null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'tip_equip_proy',
                'permissions': [('list_tipoequipo', 'Can list tipos equipos')],
            },
        ),
        migrations.CreateModel(
            name='TipoEquipoDocumento',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_archivo', models.CharField(db_column='nombre', max_length=120)),
                ('archivo', models.FileField(db_column='file', upload_to=proyectos_equipos.models.TipoEquipoDocumento.documento_upload_to)),
                ('creado_por', models.ForeignKey(blank=True, db_column='crt_by', null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
                ('tipo_equipo', models.ForeignKey(db_column='tip_equ', on_delete=django.db.models.deletion.PROTECT, related_name='documentos', to='proyectos_equipos.TipoEquipo')),
            ],
            options={
                'db_table': 'tip_equip_docs',
                'permissions': [('list_tipoequipodocumento', 'Can list documentos tipo equipo')],
            },
        ),
        migrations.CreateModel(
            name='EquipoProyecto',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nro_identificacion', models.BigIntegerField(db_column='nro_id', unique=True)),
                ('fecha_entrega', models.DateField(db_column='fec_entre', null=True)),
                ('nombre', models.CharField(max_length=200)),
                ('creado_por', models.ForeignKey(blank=True, db_column='crt_by', null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
                ('literal', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='equipos', to='proyectos.Literal')),
                ('tipo_equipo', models.ForeignKey(db_column='tip_equ', on_delete=django.db.models.deletion.PROTECT, related_name='equipos', to='proyectos_equipos.TipoEquipo')),
            ],
            options={
                'db_table': 'equip_proy',
                'permissions': [('list_equipoproyecto', 'Can list equipos proyectos')],
            },
        ),
    ]