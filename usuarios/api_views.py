from django.contrib.auth.models import User, Permission, Group
from django.db.models import Q
from knox.models import AuthToken
from rest_framework import viewsets, generics, permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from .api_serializers import (
    UsuarioSerializer,
    LoginUserSerializer,
    UserSerializer,
    UsuarioConDetalleSerializer
)
from permisos.api_serializers import PermissionSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.select_related(
        'colaborador',
        'colaborador__cargo',
        'colaborador__centro_costo'
    ).prefetch_related(
        'groups',
    ).all()
    serializer_class = UsuarioSerializer

    # def retrieve(self, request, *args, **kwargs):
    #     from django.db.models.deletion import Collector
    #     instancia = self.get_object()
    #     collector = Collector(using='default')  # or specific database
    #     collector.collect([instancia], keep_parents=True,collect_related=True)
    #     print(collector.instances_with_model())
    #     return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def mi_cuenta(self, request):
        qs = self.get_queryset().filter(
            id=request.user.id
        ).distinct()
        self.serializer_class = UsuarioConDetalleSerializer
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
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

    @action(detail=True, methods=['post'])
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

    @action(detail=False, methods=['get'])
    def validar_nuevo_usuario(self, request) -> Response:
        qs = self.get_queryset()
        validacion_reponse = {}
        username = self.request.GET.get('username', None)
        if username and qs.filter(username=username).exists():
            raise serializers.ValidationError({'username': 'Ya exite'})
        return Response(validacion_reponse)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def validar_username_login(self, request) -> Response:
        qs = self.get_queryset()
        validacion_reponse = {}
        username = self.request.GET.get('username', None)
        if username and not qs.filter(username=username).exists():
            raise serializers.ValidationError({'username': 'Este usuario no existe'})
        return Response(validacion_reponse)

    @action(detail=False, methods=['get'])
    def listar_x_permiso(self, request):
        permiso_nombre = request.GET.get('permiso_nombre')
        qs = self.get_queryset().filter(
            Q(user_permissions__codename=permiso_nombre) |
            Q(groups__permissions__codename=permiso_nombre)
        )
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        tokens = AuthToken.objects.filter(user=user)
        tokens.delete()

        if user.is_superuser:
            permissions_list = None
        else:
            permissions_list = Permission.objects.filter(
                Q(user=user) |
                Q(group__user=user)
            ).distinct()

        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user),
            "mi_cuenta": UsuarioConDetalleSerializer(
                user,
                context=self.get_serializer_context()
            ).data,
            "mis_permisos": PermissionSerializer(
                permissions_list,
                context=self.get_serializer_context(),
                many=True
            ).data,
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
