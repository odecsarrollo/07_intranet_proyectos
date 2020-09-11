from rest_framework import serializers

from postventa.models import (
    PostventaRutinaTipoEquipo,
    PostventaGarantia,
    PostventaEventoEquipo,
    PostventaEventoEquipoDocumento
)


class PostventaRutinaTipoEquipoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.descripcion

    class Meta:
        model = PostventaRutinaTipoEquipo
        fields = [
            'id',
            'to_string',
            'descripcion',
            'mes',
        ]
        read_only_fields = fields


class PostventaEventoEquipoDocumentoSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField()
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    archivo_url = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()

    def get_size(self, obj):
        if obj.imagen:
            return obj.imagen.size
        if obj.archivo:
            return obj.archivo.size
        return None

    def get_archivo_url(self, obj):
        if obj.imagen:
            return obj.imagen.url
        if obj.archivo:
            return obj.archivo.url
        return None

    def get_extension(self, obj):
        if obj.imagen:
            extension = obj.imagen.url.split('.')[-1]
            return extension.title()
        if obj.archivo:
            extension = obj.archivo.url.split('.')[-1]
            return extension.title()
        return None

    class Meta:
        model = PostventaEventoEquipoDocumento
        fields = [
            'id',
            'tipo_equipo',
            'nombre_archivo',
            'creado_por_username',
            'extension',
            'archivo_url',
            'size',
            'archivo',
            'imagen',
            'creado_por'
        ]
        read_only_fields = fields


class PostventaEventoEquipoSerializer(serializers.ModelSerializer):
    creado_por_nombre = serializers.CharField(source='creado_por.username', read_only=True)
    to_string = serializers.SerializerMethodField()
    identificado_equipo = serializers.CharField(source='equipo.identificador', read_only=True)
    cliente_nombre = serializers.CharField(source='equipo.literal.proyecto.cliente.nombre', read_only=True)
    cliente_nit = serializers.CharField(source='equipo.literal.proyecto.cliente.nit', read_only=True)
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())
    fecha_solicitud = serializers.DateField(format="%Y-%m-%d", input_formats=['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'])

    def create(self, validated_data):
        from .services import crear_postventa_evento_equipo_proyecto
        descripcion = validated_data.get('descripcion')
        creado_por = validated_data.get('created_by')
        equipo = validated_data.get('equipo')
        tipo = validated_data.get('tipo')
        fecha_solicitud = validated_data.get('fecha_solicitud')
        evento = crear_postventa_evento_equipo_proyecto(
            descripcion=descripcion,
            user_id=creado_por.id,
            equipo_id=equipo.id,
            fecha_solicitud=fecha_solicitud,
            tipo=tipo
        )
        return evento

    def get_to_string(self, obj):
        return obj.descripcion

    class Meta:
        model = PostventaEventoEquipo
        fields = [
            'id',
            'equipo',
            'descripcion',
            'fecha_solicitud',
            'fecha_inicio',
            'fecha_terminacion',
            'tipo',
            'get_tipo_display',
            'estado',
            'get_estado_display',
            'tecnico_a_cargo',
            'creado_por',
            'creado_por_nombre',
            'documentos',
            'to_string',
            'created_by',
            'identificado_equipo',
            'cliente_nombre',
            'cliente_nit',
        ]
        read_only_fields = [
            'creado_por',
            'documentos',
            'estado',
        ]


class PostventaEventoEquipoConDetalleSerializer(PostventaEventoEquipoSerializer):
    documentos = PostventaEventoEquipoDocumentoSerializer(many=True, read_only=True)


class PostventaGarantiaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.descripcion

    class Meta:
        model = PostventaGarantia
        fields = [
            'id',
            'to_string',
            'descripcion',
            'fecha_inicial',
            'fecha_final',
            'creado_por',
        ]
        read_only_fields = fields
