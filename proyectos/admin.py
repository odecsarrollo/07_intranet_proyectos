from django.contrib import admin

from .models import Proyecto, Literal, HoraColaboradorLiteralProyecto
from cguno.models import ItemsLiteralBiable


class HoraColaboradorLiteralProyectoInline(admin.TabularInline):
    model = HoraColaboradorLiteralProyecto


class LiteralInLine(admin.TabularInline):
    model = Literal
    readonly_fields = ['id', 'id_literal', 'descripcion', 'costo_materiales']
    extra = 0
    can_delete = False


class ProyectoAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'id_proyecto',
        'fecha_prometida',
        'abierto',
        'costo_materiales'
    ]
    readonly_fields = ['costo_materiales', ]
    inlines = [
        LiteralInLine
    ]


admin.site.register(Proyecto, ProyectoAdmin)


class ItemLiteralBiableInLine(admin.TabularInline):
    model = ItemsLiteralBiable
    readonly_fields = ['id', 'item_biable', 'cantidad', 'costo_total']
    extra = 0
    can_delete = False


class LiteralAdmin(admin.ModelAdmin):
    list_display = ['id', 'id_literal', 'descripcion', 'proyecto', 'costo_materiales']
    readonly_fields = ['id', 'id_literal', 'descripcion', 'proyecto', 'costo_materiales']
    inlines = [
        ItemLiteralBiableInLine,
        HoraColaboradorLiteralProyectoInline
    ]


admin.site.register(Literal, LiteralAdmin)
