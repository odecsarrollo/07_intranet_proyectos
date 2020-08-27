from rest_framework import serializers

from proyectos_equipos.models import EquipoProyecto
from proyectos_equipos.models import TipoEquipo
from proyectos_equipos.models import TipoEquipoDocumento


class TipoEquipoDocumentoSerializer(serializers.ModelSerializer):
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    archivo_url = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()

    def get_size(self, obj):
        if obj.archivo:
            return obj.archivo.size
        return None

    def get_archivo_url(self, obj):
        if obj.archivo:
            return obj.archivo.url
        return None

    def get_extension(self, obj):
        if obj.archivo:
            extension = obj.archivo.url.split('.')[-1]
            return extension.title()
        return None

    class Meta:
        model = TipoEquipoDocumento
        fields = [
            'id',
            'tipo_equipo',
            'nombre_archivo',
            'creado_por_username',
            'extension',
            'archivo_url',
            'size',
            'archivo',
            'creado_por'
        ]
        read_only_fields = fields


class TipoEquipoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    creado_por_nombre = serializers.CharField(source='creado_por.username', read_only=True)

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = TipoEquipo
        fields = [
            'id',
            'to_string',
            'nombre',
            'activo',
            'documentos',
            'creado_por',
            'creado_por_nombre'
        ]


class TipoEquipoConDetalleSerializer(TipoEquipoSerializer):
    documentos = TipoEquipoDocumentoSerializer(many=True, read_only=True)


class EquipoProyectoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    creado_por_nombre = serializers.CharField(source='creado_por.username', read_only=True)

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = EquipoProyecto
        fields = [
            'id',
            'to_string',
            'nombre',
            'literal',
            'tipo_equipo',
            'fecha_entrega',
            'nro_identificacion',

        ]


class EquipoProyectoConDetalleSerializer(serializers.ModelSerializer):
    tipo_equipo = TipoEquipoSerializer(read_only=True)
