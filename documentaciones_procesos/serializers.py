from rest_framework import serializers

from .models import (
    DocumentacionProceso,
    DocumentacionArea,
    DocumentacionProcesoDocumento,
    DocumentacionProcesoResponsable
)


class DocumentacionAreaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = DocumentacionArea
        fields = [
            'id',
            'to_string',
            'nombre',
            'lider',
        ]
        read_only_fields = fields


class DocumentacionProcesoResponsableSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = DocumentacionProcesoResponsable
        fields = [
            'id',
            'to_string',
            'proceso',
            'responsable',
            'email',
            'extencion',
        ]
        read_only_fields = fields


class DocumentacionProcesoDocumentoSerializer(serializers.ModelSerializer):
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    archivo_url = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()

    def get_size(self, obj):
        if obj.documento:
            return obj.documento.size
        return None

    def get_archivo_url(self, obj):
        if obj.documento:
            return obj.documento.url
        return None

    def get_extension(self, obj):
        if obj.documento:
            extension = obj.documento.url.split('.')[-1]
            return extension.title()
        return None

    class Meta:
        model = DocumentacionProcesoDocumento
        fields = [
            'id',
            'proceso',
            'nombre_archivo',
            'descripcion',
            'documento',
            'extension',
            'archivo_url',
            'size',
            'creado_por'
        ]
        read_only_fields = fields


class DocumentacionProcesoSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = DocumentacionProceso
        fields = [
            'id',
            'to_string',
            'area',
            'nombre',
            'lider',
            'documentos',
        ]
        read_only_fields = fields


class DocumentacionProcesoConDetalleSerializer(DocumentacionProcesoSerializer):
    documentos = DocumentacionProcesoSerializer(many=True, read_only=True)
