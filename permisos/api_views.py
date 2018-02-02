from django.contrib.auth.models import User, Permission
from django.db.models import Q

from rest_framework import viewsets, permissions, serializers
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .api_serializers import PermissionSerializer

class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

    @list_route(methods=['get'])
    def mis_permisos(self, request):
        # if request.user.is_superuser:
        #     permissions_list = Permission.objects.all()
        #     serializer = self.get_serializer(permissions_list, many=True)
        #     return Response(serializer.data)
        permissions_list = Permission.objects.filter(
            Q(user=request.user) |
            Q(group__user=request.user)
        ).distinct()
        serializer = self.get_serializer(permissions_list, many=True)
        return Response(serializer.data)
