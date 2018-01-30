from django.contrib import admin

from .models import ItemsBiable, ColaboradorBiable


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


class ColaboradorBiableAdmin(admin.ModelAdmin):
    list_display = [
        'cedula',
        'nombres',
        'apellidos',
        'en_proyectos',
        'es_cguno'
    ]
    readonly_fields = ['es_cguno']
    list_filter = [
        'es_cguno',
        'en_proyectos'
    ]
    search_fields = ['nombres', 'apellidos', 'cedula']


admin.site.register(ColaboradorBiable, ColaboradorBiableAdmin)
