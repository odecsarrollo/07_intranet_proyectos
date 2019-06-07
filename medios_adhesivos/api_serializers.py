from rest_framework import serializers
from rest_framework.request import Request

from .models import (
    Adhesivo,
    AdhesivoMovimiento
)


class AdhesivoSerializer(serializers.ModelSerializer):
    disponible = serializers.IntegerField(read_only=True)
    to_string = serializers.SerializerMethodField()
    imagen_small = serializers.ImageField(read_only=True)

    def get_to_string(self, instance):
        return instance.codigo

    class Meta:
        model = Adhesivo
        fields = [
            'url',
            'id',
            'codigo',
            'alto',
            'ancho',
            'color',
            'stock_min',
            'descripcion',
            'disponible',
            'imagen',
            'imagen_small',
            'tipo',
            'tipo_nombre',
            'to_string'
        ]


class MovimientoAdhesivoSerializer(serializers.ModelSerializer):
    creado_por_username = serializers.CharField(source='creado_por.username', read_only=True)
    adhesivo_descripcion = serializers.CharField(source='adhesivo.descripcion', read_only=True)
    tipo_adhesivo = serializers.CharField(source='adhesivo.tipo_nombre', read_only=True)
    creado_por = serializers.HiddenField(default=serializers.CurrentUserDefault())
    to_string = serializers.SerializerMethodField()

    def get_to_string(self, instance):
        return '%s de %s unidad(es) para %s' % (
            instance.get_tipo_display(), instance.cantidad, instance.adhesivo.codigo
        )

    # metodo que sobre escribe el movimiento antes de ser creados en la base de datos
    def create(self, validated_data):
        # importa el servicio que retorna el objeto modificado
        from .services import moviento_adhesivo_crear
        # extrae las caracteristicas validadas
        adhesivo = validated_data.pop('adhesivo')
        cantidad = validated_data.pop('cantidad')
        tipo = validated_data.pop('tipo')
        creado_por = validated_data.pop('creado_por')
        responsable = validated_data.get('responsable', None)
        descripcion = validated_data.get('descripcion', None)
        # modifica el movimiento
        movimiento = moviento_adhesivo_crear(
            creado_por_id=creado_por.id,
            adhesivo_id=adhesivo.id,
            cantidad=cantidad,
            tipo=tipo,
            responsable=responsable,
            descripcion=descripcion
        )
        return movimiento

    class Meta:
        model = AdhesivoMovimiento
        fields = [
            'id',
            'tipo',
            'responsable',
            'tipo_nombre',
            'adhesivo_descripcion',
            'cantidad',
            'created',
            'descripcion',
            'saldo',
            'ultimo',
            'creado_por',
            'creado_por_username',
            'adhesivo',
            'tipo_adhesivo',
            'to_string'
        ]
        # kwargs es un objeto key value
        extra_kwargs = {
            'saldo': {'read_only': True},
            'ultimo': {'read_only': True},
            'responsable': {'read_only': True}
        }
