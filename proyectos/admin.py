from django.contrib import admin

from .models import Proyecto, Literal
from cguno.models import ItemsLiteralBiable


class LiteralInLine(admin.TabularInline):
    model = Literal
    readonly_fields = ['id', 'id_literal', 'descripcion']
    extra = 0
    can_delete = False


class ProyectoAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'id_proyecto',
        'fecha_prometida',
        'cerrado'
    ]
    inlines = [LiteralInLine, ]


admin.site.register(Proyecto, ProyectoAdmin)


class ItemLiteralBiableInLine(admin.TabularInline):
    model = ItemsLiteralBiable
    readonly_fields = ['id', 'item_biable', 'cantidad', 'costo_total']
    extra = 0
    can_delete = False


class LiteralAdmin(admin.ModelAdmin):
    list_display = ['id', 'id_literal', 'descripcion']
    readonly_fields = ['id', 'id_literal', 'descripcion', 'proyecto']
    inlines = [ItemLiteralBiableInLine, ]


admin.site.register(Literal, LiteralAdmin)
