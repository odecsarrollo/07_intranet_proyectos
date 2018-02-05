from rest_framework import serializers

from .models import TasaHora


class TasaHoraSerializer(serializers.ModelSerializer):
    colaborador_nombre = serializers.CharField(source='colaborador.full_name', read_only=True)

    class Meta:
        model = TasaHora
        fields = [
            'url',
            'id',
            'mes',
            'ano',
            'colaborador',
            'colaborador_nombre',
            'costo_hora',
        ]
