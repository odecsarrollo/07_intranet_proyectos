from django.db import models


class CategoriaProducto(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    nomenclatura = models.CharField(max_length=4, unique=True)

    class Meta:
        permissions = [
            ['list_categoriaproducto', 'Puede listar categorias productos'],
        ]
