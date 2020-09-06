from rest_framework import serializers

from intranet_proyectos.general_mixins.custom_serializer_mixins import CustomSerializerMixin
from postventa.serializers import PostventaGarantiaSerializer
from postventa.serializers import PostventaRutinaTipoEquipoSerializer
from proyectos_equipos.models import EquipoProyecto
from proyectos_equipos.models import TipoEquipo
from proyectos_equipos.models import TipoEquipoCampo
from proyectos_equipos.models import TipoEquipoCampoEquipo
from proyectos_equipos.models import TipoEquipoClase
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


class TipoEquipoCampoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.label

    class Meta:
        model = TipoEquipoCampo
        fields = [
            'id',
            'to_string',
            'label',
            'tamano',
            'tamano_columna',
            'unidad_medida',
            'obligatorio',
            'tipo',
            'orden',
            'get_tipo_display',
            'tipo_equipo',
            'opciones_list'
        ]
        read_only_fields = ['documentos', 'creado_por']


class TipoEquipoClaseSerializer(CustomSerializerMixin, serializers.ModelSerializer):
    tipo_equipo_nombre = serializers.CharField(source='tipo_equipo.nombre', read_only=True)
    tipo_equipo_sigla = serializers.CharField(source='tipo_equipo.sigla', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return '%s %s' % (obj.tipo_equipo.nombre, obj.nombre)

    class Meta:
        model = TipoEquipoClase
        fields = [
            'id',
            'to_string',
            'nombre',
            'rutinas_postventa',
            'campos',
            'documentos',
            'tipo_equipo',
            'tipo_equipo_nombre',
            'tipo_equipo_sigla',
            'sigla',
            'activo'
        ]
        read_only_fields = ['documentos', 'creado_por', 'rutinas_postventa']


class TipoEquipoClaseConDetalleSerializer(TipoEquipoClaseSerializer):
    campos = TipoEquipoCampoSerializer(many=True, read_only=True)
    documentos = TipoEquipoDocumentoSerializer(many=True, read_only=True)
    rutinas_postventa = PostventaRutinaTipoEquipoSerializer(many=True, read_only=True)


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
            'sigla',
            'documentos',
            'clases_tipo_equipo',
            'campos',
            'creado_por',
            'rutinas_postventa',
            'creado_por_nombre'
        ]
        read_only_fields = [
            'documentos',
            'creado_por',
            'clases_tipo_equipo'
            'rutinas_postventa'
        ]


class TipoEquipoConDetalleSerializer(CustomSerializerMixin, TipoEquipoSerializer):
    documentos = TipoEquipoDocumentoSerializer(many=True, read_only=True)
    clases_tipo_equipo = TipoEquipoClaseConDetalleSerializer(many=True, read_only=True)
    campos = TipoEquipoCampoSerializer(many=True, read_only=True)
    rutinas_postventa = PostventaRutinaTipoEquipoSerializer(many=True, read_only=True)


class EquipoProyectoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    creado_por = serializers.HiddenField(default=serializers.CurrentUserDefault())
    id_literal = serializers.CharField(source='literal.id_literal', read_only=True)
    tipo_equipo = serializers.CharField(source='tipo_equipo_clase.tipo_equipo', read_only=True)
    creado_por_nombre = serializers.CharField(source='creado_por.username', read_only=True)

    def create(self, validated_data):
        nombre = validated_data.get('nombre')
        creado_por = validated_data.get('creado_por')
        literal = validated_data.get('literal')
        tipo_equipo_clase = validated_data.get('tipo_equipo_clase')
        from .services import equipo_proyecto_create
        equipo = equipo_proyecto_create(
            nombre=nombre,
            literal_id=literal.id,
            tipo_equipo_clase_id=tipo_equipo_clase.id,
            creado_por_id=creado_por.id
        )
        return equipo

    def get_to_string(self, obj):
        return '%s - %s' % (obj.identificador, obj.nombre)

    class Meta:
        model = EquipoProyecto
        fields = [
            'id',
            'to_string',
            'nombre',
            'literal',
            'tipo_equipo',
            'campos_valores',
            'fecha_entrega',
            'id_literal',
            'fecha_fabricacion',
            'tipo_equipo_clase',
            'identificador',
            'nro_consecutivo',
            'garantias',
            'creado_por',
            'creado_por_nombre',
        ]
        read_only_fields = ['identificador', 'nro_consecutivo', 'campos_valores']


class TipoEquipoCampoEquipoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.label

    class Meta:
        model = TipoEquipoCampoEquipo
        fields = [
            'id',
            'to_string',
            'tamano',
            'tamano_columna',
            'tipo',
            'label',
            'valor',
            'unidad_medida',
            'orden'
        ]
        read_only_fields = ['documentos', 'creado_por']


class EquipoProyectoConDetalleSerializer(EquipoProyectoSerializer):
    tipo_equipo_clase = TipoEquipoClaseConDetalleSerializer(read_only=True)
    tipo_equipo = TipoEquipoConDetalleSerializer(
        source='tipo_equipo_clase.tipo_equipo',
        read_only=True
    )
    campos_valores = TipoEquipoCampoEquipoSerializer(read_only=True, many=True)
    garantias = PostventaGarantiaSerializer(read_only=True, many=True)
