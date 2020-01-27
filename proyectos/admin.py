from django.contrib import admin

from .models import Proyecto, Literal


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
