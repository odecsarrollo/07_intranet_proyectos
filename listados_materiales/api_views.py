import json
from decimal import Decimal

from django.db.models import Max, Q, Sum
from rest_framework import viewsets, serializers
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import ItemLiteralDiseno, CantidadItemLiteralDiseno
from .api_serializers import ItemLiteralDisenoSerializer
from cguno.models import ItemsBiable


class ItemLiteralDisenoViewSet(viewsets.ModelViewSet):
    queryset = ItemLiteralDiseno.objects.all()
    serializer_class = ItemLiteralDisenoSerializer

    def get_queryset(self):
        qs = ItemLiteralDiseno.objects.annotate(
            cantidad=Sum('cantidades__cantidad'),
            cantidad_a_comprar=Sum('cantidades__cantidad_a_comprar'),
            cantidad_reservada_inventario=Sum('cantidades__cantidad_reservada_inventario')
        )
        return qs

    @list_route(methods=['post'])
    def cargar_items_listados_materiales(self, request, pk=None):
        listado_materiales = json.loads(request.POST.get('listado'))
        literal_id = request.POST.get('literal_id')
        qs = self.get_queryset().filter(literal_id=literal_id)
        if not qs.exists():
            for linea in listado_materiales:
                cantidad = linea.pop('cantidad')
                item = ItemLiteralDiseno.objects.create(
                    creado_por=self.request.user,
                    **linea
                )
                CantidadItemLiteralDiseno.objects.create(
                    item_literal_diseno=item,
                    cantidad=cantidad,
                    creado_por=self.request.user
                )
        else:
            content = {'error': ['Ya existe una lista de materiales creada para este literal. Actualize y verifique']}
            raise serializers.ValidationError(content)
        qs = self.get_queryset().filter(literal_id=literal_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['post'])
    def actualizar_items_listados_materiales(self, request, pk=None):
        cambios = json.loads(request.POST.get('cambios'))
        para_eliminar = cambios.pop('para_eliminar')
        cambia_cantidad = cambios.pop('cambia_cantidad')
        para_adicionar = cambios.pop('para_adicionar')
        cambia_fecha = cambios.pop('cambia_fecha')
        cambia_cantidad_reservada_inventario = cambios.pop('cambia_cantidad_reservada_inventario')
        cambia_cantidad_a_comprar = cambios.pop('cambia_cantidad_a_comprar')

        for item in cambia_fecha:
            fecha_requerido = item.get('fecha_requerido')
            id = item.get('id')
            elemento = ItemLiteralDiseno.objects.get(id=id)
            elemento.fecha_requerido = fecha_requerido
            elemento.save()

        for item in cambia_cantidad:
            cantidad_nueva = Decimal(item.get('cantidad'))
            cantidad_anterior = Decimal(item.get('cantidad_anterior'))
            cantidad_cambio = cantidad_nueva - cantidad_anterior
            id = item.get('id')
            elemento = ItemLiteralDiseno.objects.get(id=id)
            CantidadItemLiteralDiseno.objects.create(
                item_literal_diseno=elemento,
                cantidad=cantidad_cambio,
                creado_por=self.request.user
            )
            elemento.save()

        for item in cambia_cantidad_reservada_inventario:
            cantidad_nueva = Decimal(item.get('cantidad_reservada_inventario'))
            cantidad_anterior = Decimal(item.get('cantidad_reservada_inventario_anterior'))
            cantidad_cambio = cantidad_nueva - cantidad_anterior
            id = item.get('id')
            elemento = ItemLiteralDiseno.objects.get(id=id)
            CantidadItemLiteralDiseno.objects.create(
                item_literal_diseno=elemento,
                cantidad_reservada_inventario=cantidad_cambio,
                creado_por=self.request.user
            )
            elemento.save()

        for item in cambia_cantidad_a_comprar:
            cantidad_nueva = Decimal(item.get('cantidad_a_comprar'))
            cantidad_anterior = Decimal(item.get('cantidad_a_comprar_anterior'))
            cantidad_cambio = cantidad_nueva - cantidad_anterior
            id = item.get('id')
            elemento = ItemLiteralDiseno.objects.get(id=id)
            CantidadItemLiteralDiseno.objects.create(
                item_literal_diseno=elemento,
                cantidad_a_comprar=cantidad_cambio,
                creado_por=self.request.user
            )
            elemento.save()

        for item in para_eliminar:
            id = item.get('id')
            cantidad = Decimal(item.get('cantidad'))
            elemento = ItemLiteralDiseno.objects.get(id=id)
            elemento.eliminado = True
            elemento.save()
            CantidadItemLiteralDiseno.objects.create(
                item_literal_diseno=elemento,
                cantidad=-cantidad,
                creado_por=self.request.user
            )

        for item in para_adicionar:
            item.pop('id')
            item.pop('nuevo')
            item_cguno = item.pop('item_cguno_id')
            cantidad = Decimal(item.pop('cantidad'))
            producto_cguno = ItemsBiable.objects.filter(id_item=item_cguno).first()
            item_creado = ItemLiteralDiseno.objects.create(
                creado_por=self.request.user,
                item_cguno=producto_cguno,
                **item
            )
            CantidadItemLiteralDiseno.objects.create(
                item_literal_diseno=item_creado,
                cantidad=cantidad,
                creado_por=self.request.user
            )
            # id = item.get('id')
            # cantidad = Decimal(item.get('cantidad'))
            # elemento = ItemLiteralDiseno.objects.get(id=id)
            # elemento.eliminado = True
            # elemento.save()
            # CantidadItemLiteralDiseno.objects.create(
            #     item_literal_diseno=elemento,
            #     cantidad=-cantidad,
            #     creado_por=self.request.user
            # )

        literal_id = request.POST.get('literal_id')
        qs = self.get_queryset().filter(literal_id=literal_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def por_literal(self, request, pk=None):
        literal_id = request.GET.get('literal_id')
        qs = self.get_queryset().filter(literal_id=literal_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
