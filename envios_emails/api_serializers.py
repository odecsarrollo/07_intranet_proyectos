from rest_framework import serializers

from .models import CotizacionComponenteEnvio


class CotizacionComponenteEnvioSerializer(serializers.ModelSerializer):
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    archivo_version = serializers.CharField(source='archivo.version', read_only=True)
    archivo_url = serializers.SerializerMethodField()
    extension = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    archivo_name = serializers.SerializerMethodField()

    def get_archivo_url(self, obj):
        if obj.archivo:
            try:
                return obj.archivo.pdf_cotizacion.url
            except FileNotFoundError as exc:
                return None
        return None

    def get_archivo_name(self, obj):
        if obj.archivo:
            try:
                return obj.archivo.pdf_cotizacion.name.split('/')[-1]
            except FileNotFoundError as exc:
                return None
        return None

    def get_extension(self, obj):
        extension = ''
        if obj.archivo:
            try:
                extension = obj.archivo.pdf_cotizacion.url.split('.')[-1]
            except FileNotFoundError as exc:
                return None
        return extension.title()

    def get_size(self, obj):
        if obj.archivo:
            try:
                return obj.archivo.pdf_cotizacion.size
            except FileNotFoundError as exc:
                return None
        return None

    class Meta:
        model = CotizacionComponenteEnvio
        fields = [
            'id',
            'cotizacion_componente',
            'extension',
            'archivo_version',
            'archivo_name',
            'creado_por_username',
            'archivo_url',
            'size',
            'archivo',
            'creado_por',
            'correo_from',
            'correos_to',
        ]
