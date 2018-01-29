from django.contrib import admin

from .models import ItemsBiable


class ItemBiableAdmin(admin.ModelAdmin):
    list_display = [
        'id_item',
        'id_referencia',
        'descripcion',
        'activo',
        'nombre_tercero',
        'desc_item_padre',
        'unidad_medida_inventario',
        'id_procedencia',
        'ultimo_costo'
    ]
    readonly_fields = [
        'id_item',
        'id_referencia',
        'descripcion_dos',
        'descripcion',
        'activo',
        'nombre_tercero',
        'desc_item_padre',
        'unidad_medida_inventario',
        'id_procedencia',
        'ultimo_costo'
    ]
    list_filter = ['activo']


admin.site.register(ItemsBiable, ItemBiableAdmin)
