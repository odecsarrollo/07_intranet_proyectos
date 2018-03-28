from django.contrib.auth.models import User
from rest_framework import serializers

from cguno.api_serializers import ColaboradorBiableSerializer


class UsuarioSerializer(serializers.ModelSerializer):
    colaborador = ColaboradorBiableSerializer(many=False, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'is_active',
            'is_staff',
            'password',
            'username',
            'last_login',
            'date_joined',
            'is_superuser',
            'colaborador',
            'groups',
        ]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
