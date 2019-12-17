from rest_framework import serializers

from .models import CiudadCatalogo


class CiudadCatalogoSerializer(serializers.ModelSerializer):
    sistema_informacion_nombre = serializers.CharField(source='sistema_informacion.nombre', read_only=True)
    departamento_intranet_nombre = serializers.CharField(source='ciudad_intranet.departamento.nombre', read_only=True)
    ciudad_intranet_nombre = serializers.CharField(source='ciudad_intranet.nombre', read_only=True)
    departamento_nombre = serializers.CharField(source='departamento.nombre', read_only=True)
    pais_nombre = serializers.CharField(source='departamento.pais.nombre', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, obj):
        return obj.nombre

    class Meta:
        model = CiudadCatalogo
        fields = [
            'url',
            'id',
            'nombre',
            'ciudad_intranet',
            'ciudad_intranet_nombre',
            'departamento_intranet_nombre',
            'sistema_informacion_nombre',
            'departamento',
            'pais_nombre',
            'departamento_nombre',
            'to_string',
        ]
