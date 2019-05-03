from django.db import models


class CategoriaProducto(models.Model):
    nombre = models.CharField(max_length=120, unique=True)
    nomenclatura = models.CharField(max_length=3, unique=True)

    class Meta:
        permissions = [
            ['list_categoriaproducto', 'Puede listar categorias productos'],
        ]

# class CategoriaDos(models.Model):
#     nombre = models.CharField(max_length=120, unique=True)
#     nomenclatura = models.CharField(max_length=4, unique=True)
#
#
# class TipoProducto(models.Model):
#     nombre = models.CharField(max_length=120, unique=True)
#     nomenclatura = models.CharField(max_length=4, unique=True)



# class CategoriaCategoriaDos(models.Model):
#     categoria_uno = models.ForeignKey(
#         CategoriaProducto,
#         related_name='categorias_dos',
#         on_delete=models.PROTECT
#     )
#     categoria_dos = models.ForeignKey(
#         CategoriaDos,
#         related_name='categorias_uno',
#         on_delete=models.PROTECT
#     )
#
#     class Meta:
#         unique_together = ["categoria_uno", "categoria_dos"]
#
#
# class TipoProductoCategoria(models.Model):
#     categoria_uno = models.ForeignKey(
#         CategoriaProducto,
#         related_name='tipos',
#         on_delete=models.PROTECT
#     )
#     tipo = models.ForeignKey(
#         TipoProducto,
#         on_delete=models.PROTECT,
#         related_name='categorias'
#     )
#
#     class Meta:
#         unique_together = ["categoria_uno", "tipo"]
