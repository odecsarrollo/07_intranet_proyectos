from rest_framework import serializers

from .models import (
    ClienteBiable,
    ContactoCliente,
    CanalDistribucion,
    TipoIndustria
)


class TipoIndustriaSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = TipoIndustria
        fields = [
            'url',
            'id',
            'nombre',
            'descripcion',
            'to_string',
        ]


class CanalDistribucionSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = CanalDistribucion
        fields = [
            'url',
            'id',
            'nombre',
            'to_string',
        ]


class ClienteSerializer(serializers.ModelSerializer):
    to_string = serializers.SerializerMethodField()
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)

    def create(self, validated_data):
        from .services import asignar_colaborador_vendedor_componentes, asignar_colaborador_vendedor_proyectos
        colaborador_componentes = validated_data.get('colaborador_componentes', None)
        colaborador_proyectos = validated_data.get('colaborador_proyectos', None)
        cliente = super().create(validated_data)
        asignar_colaborador_vendedor_componentes(
            colaborador_id=colaborador_componentes.id if colaborador_componentes is not None else None,
            cliente_id=cliente.id
        )
        asignar_colaborador_vendedor_proyectos(
            colaborador_id=colaborador_proyectos.id if colaborador_proyectos is not None else None,
            cliente_id=cliente.id
        )
        return cliente

    def update(self, instance, validated_data):
        from .services import asignar_colaborador_vendedor_componentes, asignar_colaborador_vendedor_proyectos
        colaborador_componentes = validated_data.get('colaborador_componentes', None)
        colaborador_proyectos = validated_data.get('colaborador_proyectos', None)
        cliente = super().update(instance, validated_data)
        asignar_colaborador_vendedor_componentes(
            colaborador_id=colaborador_componentes.id if colaborador_componentes is not None else None,
            cliente_id=cliente.id
        )
        asignar_colaborador_vendedor_proyectos(
            colaborador_id=colaborador_proyectos.id if colaborador_proyectos is not None else None,
            cliente_id=cliente.id
        )
        return cliente

    def get_to_string(self, instance):
        return instance.nombre

    class Meta:
        model = ClienteBiable
        fields = [
            'url',
            'id',
            'nit',
            'nombre',
            'sincronizado_sistemas_informacion',
            'nueva_desde_cotizacion',
            'colaborador_componentes',
            'colaborador_proyectos',
            'to_string',
            'creado_por_username',
        ]


class ContactoClienteSerializer(serializers.ModelSerializer):
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return instance.full_nombre

    class Meta:
        model = ContactoCliente
        fields = [
            'url',
            'id',
            'cliente',
            'nombres',
            'apellidos',
            'pais',
            'ciudad',
            'creado_por_username',
            'correo_electronico',
            'correo_electronico_2',
            'telefono',
            'telefono_2',
            'full_nombre',
            'cargo',
            'to_string',
        ]
        extra_kwargs = {
            'full_nombre': {'read_only': True},
            'correo_electronico_2': {'allow_null': True},
            'telefono': {'allow_null': True},
            'telefono_2': {'allow_null': True},
            'cargo': {'allow_null': True},
        }
