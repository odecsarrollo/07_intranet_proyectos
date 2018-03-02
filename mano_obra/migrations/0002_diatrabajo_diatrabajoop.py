# Generated by Django 2.0.1 on 2018-02-05 15:58

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('cguno', '0009_auto_20180130_1733'),
        ('proyectos', '0009_auto_20180205_1432'),
        ('mano_obra', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DiaTrabajo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('fecha', models.DateField()),
                ('colaborador', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='mis_dias_trabajados', to='cguno.ColaboradorBiable')),
                ('tasa', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='mano_obra.TasaHora')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='DiaTrabajoOp',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('cantidad_minutos', models.PositiveIntegerField(default=0)),
                ('dia', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='mis_horas_trabajadas', to='mano_obra.DiaTrabajo')),
                ('literal', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='mis_horas_trabajadas', to='proyectos.Literal')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]