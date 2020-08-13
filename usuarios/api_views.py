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
    #     instancia = self.get_object()
    #     # from django.db.utils import DEFAULT_DB_ALIAS
    #     # from django.contrib.admin.utils import NestedObjects
    #     #
    #     # collector = NestedObjects(using=DEFAULT_DB_ALIAS)
    #     # collector.collect([instancia])
    #     #
    #     # protected = collector.protected
    #     #
    #     # modelos_protegidos = {'protegidos': {}, 'eliminar': {}}
    #     # for x in protected:
    #     #     if not modelos_protegidos['protegidos'].get(x._meta.verbose_name_plural, None):
    #     #         modelos_protegidos['protegidos'][x._meta.verbose_name_plural] = 1
    #     #     else:
    #     #         modelos_protegidos['protegidos'][x._meta.verbose_name_plural] += 1
    #     #
    #     # for model, objs in collector.model_objs.items():
    #     #     if not modelos_protegidos['eliminar'].get(model._meta.verbose_name_plural, None):
    #     #         modelos_protegidos['eliminar'][model._meta.verbose_name_plural] = len(objs)
    #     #     else:
    #     #         modelos_protegidos['eliminar'][model._meta.verbose_name_plural] += len(objs)
    #     #
    #     # print(modelos_protegidos)
    #
    #     # print('to delete')
    #     # print(to_delete)
    #     # print('protected')
    #     # print(protected)
    #     # print('model count')
    #     # print(model_count)
    #
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
    def cambiar_contrasena(self, request, pk=None):
        from .services import user_cambiar_contrasena
        usuario = self.get_object()
        password_old = request.POST.get('password_old')
        password = request.POST.get('password')
        password_2 = request.POST.get('password_2')
        user_cambiar_contrasena(usuario.id, password_old, password, password_2)
        return Response({'result': 'La contraseña se ha cambiado correctamente'})

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


class LoginViewSet(viewsets.ModelViewSet):
    serializer_class = LoginUserSerializer
    queryset = User.objects.all()

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request) -> Response:
        serializer = self.get_serializer(data=self.request.POST)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        tokens = AuthToken.objects.filter(user=user)
        tokens.delete()
        _, token = AuthToken.objects.create(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token,
        })

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny, ])
    def cargar_usuario(self, request) -> Response:
        if self.request.user.is_anonymous:
            serializer = UsuarioConDetalleSerializer(None, context={'request': request})
            return Response(serializer.data)
        serializer = UsuarioConDetalleSerializer(self.request.user, context={'request': request})
        return Response(serializer.data)
