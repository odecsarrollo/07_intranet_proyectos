from django.db import models


class Proyecto(models.Model):
    id_proyecto = models.CharField(max_length=15, unique=True)
    fecha_prometida = models.DateField(null=True, blank=True)
    cerrado = models.BooleanField(default=False)

    def __str__(self):
        return self.id_proyecto

    class Meta:
        verbose_name = 'Proyecto'
        verbose_name_plural = 'Proyectos'


class Literal(models.Model):
    id_literal = models.CharField(max_length=15, primary_key=True)
    proyecto = models.ForeignKey(Proyecto, related_name='mis_literales', on_delete=models.PROTECT)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    fecha_iniciacion = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.id_literal

    class Meta:
        verbose_name = 'Literal'
        verbose_name_plural = 'Literales'
