from rest_framework import serializers
from .models import CorreoAplicacion


class CorreoAplicacionSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def create(self, validated_data):
        from .services import correo_aplicacion_crear_actualizar
        email = validated_data.get('email', None)
        tipo = validated_data.get('tipo', None)
        aplicacion = validated_data.get('aplicacion', None)
        alias_from = validated_data.get('alias_from', None)
        correo_aplicacion = correo_aplicacion_crear_actualizar(
            email=email,
            tipo=tipo,
            aplicacion=aplicacion,
            alias_from=alias_from,
        )
        return correo_aplicacion

    def update(self, instance, validated_data):
        from .services import correo_aplicacion_crear_actualizar
        email = validated_data.get('email', None)
        tipo = validated_data.get('tipo', None)
        alias_from = validated_data.get('alias_from', None)
        correo_aplicacion = correo_aplicacion_crear_actualizar(
            email=email,
            tipo=tipo,
            alias_from=alias_from,
            correo_aplicacion_id=instance.id
        )
        return correo_aplicacion

    def get_to_string(self, obj):
        return obj.email

    class Meta:
        model = CorreoAplicacion
        fields = [
            'url',
            'id',
            'to_string',
            'email',
            'tipo',
            'get_tipo_display',
            'aplicacion',
            'alias_from',
        ]
        extra_kwargs = {
            'aplicacion': {'allow_null': True},
        }
        read_only_fields = ['get_tipo_display']
