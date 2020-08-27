from io import BytesIO

from django.db.models import Sum, F, ExpressionWrapper, DecimalField, IntegerField, OuterRef, Subquery, Count, Q
from django.utils.timezone import datetime
from django.db.models.expressions import Exists
from django.db.models.functions import Coalesce
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from intranet_proyectos.utils_queryset import query_varios_campos
from .models import (
    Proyecto,
    Literal,
    MiembroLiteral,
    ArchivoLiteral,
    ArchivoProyecto
)
from proyectos_seguimientos.models import (
    Fase,
    FaseLiteral,
    TareaFase
)
from .api_serializers import (
    ProyectoSerializer,
    LiteralSerializer,
    MiembroLiteralSerializer,
    ArchivoLiteralSerializer,
    ArchivoProyectoSerializer,
    ProyectoConDetalleSerializer,
    ProyectoMaestraSerializer,
    ConsecutivoProyectoSerializer,
    LiteralMaestraSerializer)
from mano_obra.models import HoraHojaTrabajo, HoraTrabajoColaboradorLiteralInicial
from .mixins import LiteralesPDFMixin

class ArchivoLiteralViewSet(viewsets.ModelViewSet):
    queryset = ArchivoLiteral.objects.select_related('literal', 'creado_por').all()
    serializer_class = ArchivoLiteralSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.using('read_only')
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_literal(self, request):
        literal_id = request.GET.get('literal_id')
        qs = self.queryset.using('read_only').filter(literal_id=literal_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ArchivoProyectosViewSet(viewsets.ModelViewSet):
    queryset = ArchivoProyecto.objects.select_related('proyecto', 'creado_por').all()
    serializer_class = ArchivoProyectoSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.using('read_only')
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_proyecto(self, request):
        proyecto_id = request.GET.get('proyecto_id')
        qs = self.queryset.using('read_only').filter(proyecto_id=proyecto_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class MiembroLiteralViewSet(LiteralesPDFMixin, viewsets.ModelViewSet):
    queryset = MiembroLiteral.objects.select_related(
        'usuario',
        'usuario__colaborador',
    ).all()
    serializer_class = MiembroLiteralSerializer

    @action(detail=False, http_method_names=['get', ])
    def por_literal(self, request):
        literal_id = request.GET.get('literal_id')
        qs = None
        if literal_id:
            qs = self.get_queryset().filter(literal_id=literal_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class ProyectoViewSet(LiteralesPDFMixin, viewsets.ModelViewSet):
    queryset = Proyecto.sumatorias.mano_obra().all()
    serializer_class = ProyectoConDetalleSerializer

    def retrieve(self, request, *args, **kwargs):
        self.queryset = Proyecto.sumatorias.todo()
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        self.queryset = Proyecto.sumatorias.todo()
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.queryset = Proyecto.sumatorias.todo()
        return super().update(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        self.serializer_class = ProyectoSerializer
        self.queryset = self.queryset.using('read_only')
        from .services import proyecto_correr_actualizacion_clientes
        proyecto_correr_actualizacion_clientes()
        return super().list(request, *args, **kwargs)

    @action(detail=False, http_method_names=['get', ])
    def proyectos_por_cliente(self, request):
        cliente_id = self.request.GET.get('cliente_id')
        lista = self.queryset.using('read_only').filter(cliente_id=cliente_id)
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def proyectos_con_cotizaciones(self, request):
        self.queryset = Proyecto.sumatorias.annotate(
            cantidad_conexiones=Count('cotizaciones')
        ).prefetch_related('cotizaciones').filter(
            cantidad_conexiones__gt=0
        ).using('read_only').all()
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_rangos_consecutivos_por_ano(self, request):
        listado = []
        qs = Proyecto.objects.using('read_only').values_list('id_proyecto', flat=True).exclude(
            id_proyecto__in=['OP99999', 'OP10168'])
        [listado.append(x[0:4]) for x in qs.all()]
        listado_dic = {}
        for x in set(listado):
            if x[0:2] not in listado_dic:
                listado_dic[x[0:2]] = [x]
            else:
                listado_dic[x[0:2]].append(x)
                listado_dic[x[0:2]].sort(reverse=True)
        return Response({'lista': listado_dic})

    @action(detail=False, http_method_names=['get', ])
    def listar_consecutivo_proyectos(self, request):
        tipo_proyecto = request.GET.get('tipo_proyecto')
        abierto = request.GET.get('abierto')
        rango_actual = request.GET.get('rango_actual')
        qs = Proyecto.objects.using('read_only').select_related('cliente').prefetch_related(
            'cotizaciones',
            'cotizaciones__cotizaciones_adicionales',
            'mis_literales',
            'mis_literales__disenador',
            'mis_literales__disenador',
            'mis_literales__cotizaciones',
            'mis_literales__cotizaciones__cotizacion_inicial',
            'mis_literales__cotizaciones__cotizaciones_adicionales',
        )
        if rango_actual != 'TODO':
            qs = qs.filter(id_proyecto__startswith=rango_actual[0:4])
        if tipo_proyecto != 'TODO':
            qs = qs.filter(id_proyecto__startswith=tipo_proyecto)
        if abierto != 'TODO':
            qs = qs.filter(abierto=abierto == 'SI')
        self.serializer_class = ConsecutivoProyectoSerializer
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def listar_consecutivo_proyectos_id(self, request, pk=None):
        qs = Proyecto.objects.using('read_only').select_related('cliente').prefetch_related(
            'cotizaciones',
            'cotizaciones__cotizaciones_adicionales',
            'mis_literales',
            'mis_literales__disenador',
            'mis_literales__disenador',
            'mis_literales__cotizaciones',
            'mis_literales__cotizaciones__cotizacion_inicial',
            'mis_literales__cotizaciones__cotizaciones_adicionales',
        ).get(pk=pk)
        self.serializer_class = ConsecutivoProyectoSerializer
        serializer = self.get_serializer(qs)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_proyectos_x_parametro(self, request):
        parametro = request.GET.get('parametro')
        qs = None
        search_fields = ['id_proyecto', 'nombre']
        if search_fields:
            qs = query_varios_campos(self.queryset.using('read_only'), search_fields, parametro)
        self.serializer_class = ProyectoConDetalleSerializer
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def upload_archivo(self, request, pk=None):
        nombre_archivo = self.request.POST.get('nombre')
        proyecto = self.get_object()
        archivo = self.request.FILES['archivo']
        archivo_proyecto = ArchivoProyecto()
        archivo_proyecto.archivo = archivo
        archivo_proyecto.proyecto = proyecto
        archivo_proyecto.nombre_archivo = nombre_archivo
        archivo_proyecto.creado_por = self.request.user
        archivo_proyecto.save()
        serializer = self.get_serializer(proyecto)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def envio_correo_aperturas_almacen(self, request, pk=None):
        from .services import proyecto_envio_correo_apertura_proyectos_para_almacen
        proyecto = proyecto_envio_correo_apertura_proyectos_para_almacen(proyecto_id=pk)
        serializer = self.get_serializer(proyecto)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def abiertos(self, request):
        self.serializer_class = ProyectoSerializer
        lista = self.queryset.using('read_only').filter(abierto=True).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def con_literales_abiertos(self, request):
        self.queryset = Proyecto.objects.using('read_only').all()
        self.serializer_class = ProyectoMaestraSerializer
        lista = self.queryset.filter(
            Q(abierto=True) &
            Q(mis_literales__abierto=True)
        ).distinct()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def print_costos(self, request, pk=None):
        id_proyecto = request.GET.get('id_proyecto', None)
        fecha_inicial = request.GET.get('fecha_inicial', None)
        fecha_final = request.GET.get('fecha_final', None)
        con_mo_saldo_inicial = request.GET.get('con_mo_saldo_inicial', None)

        if not fecha_final or not fecha_inicial:
            con_mo_saldo_inicial = True
        elif con_mo_saldo_inicial == 'false':
            con_mo_saldo_inicial = False
        elif con_mo_saldo_inicial == 'true':
            con_mo_saldo_inicial = True
        else:
            con_mo_saldo_inicial = False

        proyecto = Proyecto.objects.filter(id_proyecto=id_proyecto).first()
        main_doc = self.generar_pdf(self.request, fecha_inicial, fecha_final, con_mo_saldo_inicial, proyecto)
        output = BytesIO()
        main_doc.write_pdf(
            target=output
        )
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        response.write(output.getvalue())
        output.close()
        return response

    @action(detail=False, methods=['get'])
    def print_costos_dos(self, request, pk=None):
        fecha_inicial = request.GET.get('fecha_inicial', None)
        fecha_final = request.GET.get('fecha_final', None)
        con_mo_saldo_inicial = request.GET.get('con_mo_saldo_inicial', None)

        if not fecha_final or not fecha_inicial:
            con_mo_saldo_inicial = True
        elif con_mo_saldo_inicial == 'false':
            con_mo_saldo_inicial = False
        elif con_mo_saldo_inicial == 'true':
            con_mo_saldo_inicial = True
        else:
            con_mo_saldo_inicial = False

        main_doc = self.generar_pdf_costos_dos(self.request, fecha_inicial, fecha_final, con_mo_saldo_inicial)
        output = BytesIO()
        main_doc.write_pdf(
            target=output
        )
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="somefilename.pdf"'
        response['Content-Transfer-Encoding'] = 'binary'
        response.write(output.getvalue())
        output.close()
        return response


class LiteralViewSet(viewsets.ModelViewSet):
    queryset = Literal.objects.select_related(
        'proyecto'
    ).all()
    serializer_class = LiteralSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = self.queryset.using('read_only')
        return super().list(request, *args, **kwargs)

    @action(detail=False, http_method_names=['get', ])
    def listar_literales_x_parametro(self, request):
        parametro = request.GET.get('parametro')
        qs = None
        search_fields = ['id_literal', 'descripcion']
        if search_fields:
            qs = query_varios_campos(self.queryset.using('read_only'), search_fields, parametro)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        mano_obra = HoraHojaTrabajo.objects.values('literal').annotate(
            cantidad_horas=ExpressionWrapper(Sum((F('cantidad_minutos') / 60)),
                                             output_field=DecimalField(max_digits=4)),
            costo_total=ExpressionWrapper(
                Sum((F('cantidad_minutos') / 60) * (
                        (F('hoja__tasa__costo') + F('hoja__tasa__otro_costo')) / F(
                    'hoja__tasa__nro_horas_mes_trabajadas'))),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal_id=OuterRef('id'),
            verificado=True
        )
        mano_obra_inicial = HoraTrabajoColaboradorLiteralInicial.objects.values('literal').annotate(
            cantidad_horas=ExpressionWrapper(Sum((F('cantidad_minutos') / 60)),
                                             output_field=DecimalField(max_digits=4)),
            costo_total=ExpressionWrapper(
                Sum('valor'),
                output_field=DecimalField(max_digits=4))
        ).filter(
            literal_id=OuterRef('id')
        )

        qs = Literal.objects.select_related(
            'proyecto'
        ).annotate(
            costo_mano_obra=
            Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra.values('costo_total')),
                    output_field=DecimalField(max_digits=4)
                ),
                0
            ),
            costo_mano_obra_inicial=
            Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra_inicial.values('costo_total')),
                    output_field=DecimalField(max_digits=4)
                ),
                0
            ),
            cantidad_horas_mano_obra=
            Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra.values('cantidad_horas')),
                    output_field=DecimalField(max_digits=4)
                ),
                0
            ),
            cantidad_horas_mano_obra_inicial=
            Coalesce(
                ExpressionWrapper(
                    Subquery(mano_obra_inicial.values('cantidad_horas')),
                    output_field=DecimalField(max_digits=4)
                ),
                0
            ),
        )
        return qs

    @action(detail=True, methods=['post'])
    def upload_archivo(self, request, pk=None):
        nombre_archivo = self.request.POST.get('nombre')
        literal = self.get_object()
        archivo = self.request.FILES['archivo']
        archivo_literal = ArchivoLiteral()
        archivo_literal.archivo = archivo
        archivo_literal.literal = literal
        archivo_literal.nombre_archivo = nombre_archivo
        archivo_literal.creado_por = self.request.user
        archivo_literal.save()
        serializer = self.get_serializer(literal)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_quitar_fase(self, request, pk=None):
        literal = self.get_object()
        id_fase = int(request.POST.get('id_fase'))
        tiene_fase = literal.mis_fases.filter(fase_id=id_fase)
        fase = Fase.objects.get(id=id_fase)
        # tiene_fase = literal.mis_fases.filter(id=fase).exists()
        # print(tiene_fase)
        if not tiene_fase:
            FaseLiteral.objects.create(fase=fase, literal=literal)
        else:
            FaseLiteral.objects.filter(fase=fase, literal=literal).delete()
        serializer = self.get_serializer(literal)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def adicionar_miembro(self, request, pk=None):
        literal = self.get_object()
        id_usuario = int(request.POST.get('id_usuario'))
        miembro_usuario = literal.mis_miembros.filter(usuario_id=id_usuario)
        if not miembro_usuario.exists():
            MiembroLiteral.objects.create(usuario_id=id_usuario, literal=literal)
        serializer = self.get_serializer(literal)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def quitar_miembro(self, request, pk=None):
        literal = self.get_object()
        id_usuario = int(request.POST.get('id_usuario'))
        miembro_usuario = literal.mis_miembros.filter(usuario_id=id_usuario)
        if miembro_usuario.exists():
            miembro_usuario.delete()
        serializer = self.get_serializer(literal)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def abiertos(self, request):
        lista = self.get_queryset().filter(abierto=True).all()
        serializer = self.get_serializer(lista.using('read_only'), many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def con_seguimiento(self, request):
        tareas_vencidas = TareaFase.objects.using('read_only').values('fase_literal__literal_id').annotate(
            cantidad=ExpressionWrapper(
                Count('id'),
                output_field=IntegerField()
            ),
        ).filter(
            fecha_limite__lte=datetime.now(),
            fase_literal__literal_id=OuterRef('id')
        ).exclude(
            estado=4
        ).distinct()

        tareas_totales = TareaFase.objects.using('read_only').values('fase_literal__literal_id').annotate(
            cantidad=ExpressionWrapper(
                Count('id'),
                output_field=IntegerField()
            ),
        ).filter(
            fase_literal__literal_id=OuterRef('id')
        ).distinct()

        tareas_nueva = TareaFase.objects.using('read_only').values('fase_literal__literal_id').annotate(
            cantidad=ExpressionWrapper(
                Count('id'),
                output_field=IntegerField()
            ),
        ).filter(
            fase_literal__literal_id=OuterRef('id'),
            estado=1
        ).distinct()

        tareas_pendientes = TareaFase.objects.using('read_only').values('fase_literal__literal_id').annotate(
            cantidad=ExpressionWrapper(
                Count('id'),
                output_field=IntegerField()
            ),
        ).filter(
            fase_literal__literal_id=OuterRef('id'),
            estado=2
        ).distinct()

        tareas_en_proceso = TareaFase.objects.using('read_only').values('fase_literal__literal_id').annotate(
            cantidad=ExpressionWrapper(
                Count('id'),
                output_field=IntegerField()
            ),
        ).filter(
            fase_literal__literal_id=OuterRef('id'),
            estado=3
        ).distinct()

        tareas_terminadas = TareaFase.objects.using('read_only').values('fase_literal__literal_id').annotate(
            cantidad=ExpressionWrapper(
                Count('id'),
                output_field=IntegerField()
            ),
        ).filter(
            estado=4,
            fase_literal__literal_id=OuterRef('id')
        ).distinct()

        lista = self.queryset.using('read_only').annotate(
            cantidad_tareas_vencidas=
            Coalesce(
                ExpressionWrapper(
                    Subquery(tareas_vencidas.values('cantidad')),
                    output_field=IntegerField()
                ),
                0
            ),
            cantidad_tareas_totales=
            Coalesce(
                ExpressionWrapper(
                    Subquery(tareas_totales.values('cantidad')),
                    output_field=IntegerField()
                ),
                0
            ),
            cantidad_tareas_nuevas=
            Coalesce(
                ExpressionWrapper(
                    Subquery(tareas_nueva.values('cantidad')),
                    output_field=IntegerField()
                ),
                0
            ),
            cantidad_tareas_pendientes=
            Coalesce(
                ExpressionWrapper(
                    Subquery(tareas_pendientes.values('cantidad')),
                    output_field=IntegerField()
                ),
                0
            ),
            cantidad_tareas_en_proceso=
            Coalesce(
                ExpressionWrapper(
                    Subquery(tareas_en_proceso.values('cantidad')),
                    output_field=IntegerField()
                ),
                0
            ),
            cantidad_tareas_terminadas=
            Coalesce(
                ExpressionWrapper(
                    Subquery(tareas_terminadas.values('cantidad')),
                    output_field=IntegerField()
                ),
                0
            ),
        ).filter(fase__mis_literales__isnull=False).distinct().all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def proyecto_abierto(self, request):
        literales_abiertos = Literal.objects.using('read_only').filter(
            proyecto_id=OuterRef('proyecto_id'),
            abierto=True
        )
        lista = self.queryset.using('read_only').annotate(
            proyecto_con_literales_abierto=Exists(literales_abiertos)
        ).filter(
            proyecto__abierto=True,
            proyecto_con_literales_abierto=True
        ).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def listar_x_proyecto(self, request):
        proyecto_id = request.GET.get('proyecto_id')
        self.serializer_class = LiteralMaestraSerializer
        qs = None
        if proyecto_id:
            qs = self.queryset.using('read_only').filter(proyecto_id=proyecto_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, http_method_names=['get', ])
    def sin_sincronizar(self, request):
        lista = self.queryset.using('read_only').filter(en_cguno=False).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)


