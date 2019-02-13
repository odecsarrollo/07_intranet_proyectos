from django.contrib.auth.models import User, Permission, Group
from django.db.models import Q
from rest_framework import viewsets, serializers, permissions
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response

from .api_serializers import UsuarioSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related(
        'colaborador',
        'colaborador__cargo',
        'colaborador__centro_costo'
    ).all()
    serializer_class = UsuarioSerializer

    @list_route(methods=['get'])
    def mi_cuenta(self, request):
        qs = self.get_queryset().filter(
            id=request.user.id
        ).distinct()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def adicionar_permiso(self, request, pk=None):
        usuario = self.get_object()
        id_permiso = int(request.POST.get('id_permiso'))
        permiso = Permission.objects.get(id=id_permiso)

        tiene_permiso = usuario.user_permissions.filter(id=id_permiso).exists()
        if not tiene_permiso:
            usuario.user_permissions.add(permiso)
        else:
            usuario.user_permissions.remove(permiso)

        serializer = self.get_serializer(usuario)
        return Response(serializer.data)

    @detail_route(methods=['post'])
    def adicionar_grupo(self, request, pk=None):
        usuario = self.get_object()
        id_grupo = int(request.POST.get('id_grupo'))
        permiso = Group.objects.get(id=id_grupo)

        tiene_grupo = usuario.groups.filter(id=id_grupo).exists()
        if not tiene_grupo:
            usuario.groups.add(permiso)
        else:
            usuario.groups.remove(permiso)

        serializer = self.get_serializer(usuario)
        return Response(serializer.data)

    @list_route(methods=['get'])
    def validar_nuevo_usuario(self, request) -> Response:
        qs = self.get_queryset()
        validacion_reponse = {}
        username = self.request.GET.get('username', None)
        if username and qs.filter(username=username).exists():
            raise serializers.ValidationError({'username': 'Ya exite'})
        return Response(validacion_reponse)

    @list_route(methods=['get'], permission_classes=[permissions.AllowAny])
    def validar_username_login(self, request) -> Response:
        qs = self.get_queryset()
        validacion_reponse = {}
        username = self.request.GET.get('username', None)
        if username and not qs.filter(username=username).exists():
            raise serializers.ValidationError({'username': 'Este usuario no existe'})
        return Response(validacion_reponse)

    @list_route(methods=['get'])
    def listar_x_permiso(self, request):
        permiso_nombre = request.GET.get('permiso_nombre')
        qs = self.get_queryset().filter(
            Q(user_permissions__codename=permiso_nombre) |
            Q(groups__permissions__codename=permiso_nombre)
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
