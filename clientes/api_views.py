from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    ClienteBiable,
    ContactoCliente,
    TipoIndustria,
    CanalDistribucion
)
from .api_serializers import (
    ClienteSerializer,
    ContactoClienteSerializer,
    TipoIndustriaSerializer,
    CanalDistribucionSerializer
)


class TipoIndustriaViewSet(viewsets.ModelViewSet):
    queryset = TipoIndustria.objects.all()
    serializer_class = TipoIndustriaSerializer


class CanalDistribucionViewSet(viewsets.ModelViewSet):
    queryset = CanalDistribucion.objects.all()
    serializer_class = CanalDistribucionSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    queryset = ClienteBiable.objects.all()
    serializer_class = ClienteSerializer

    @action(detail=True, methods=['post'])
    def fusionar_clientes(self, request, pk=None):
        from .services import fusionar_clientes
        cliente_a_eliminar_id = request.POST.get('cliente_a_eliminar_id', None)
        cliente_permanece = fusionar_clientes(
            cliente_que_permanece_id=pk,
            cliente_a_eliminar_id=cliente_a_eliminar_id
        )
        return Response(
            {'result': 'La fusión se ha realizado con éxito para el cliente %s' % (cliente_permanece.nombre)})


class ContactoClienteViewSet(viewsets.ModelViewSet):
    queryset = ContactoCliente.objects.select_related('creado_por').all()
    serializer_class = ContactoClienteSerializer

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=False, http_method_names=['get', ])
    def por_cliente(self, request):
        cliente_id = request.GET.get('cliente_id')
        lista = self.queryset.filter(cliente_id=cliente_id).all()
        serializer = self.get_serializer(lista, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def contacto_cliente_crear_desde_cotizacion(self, request):
        from .services import contacto_cliente_crear_desde_cotizacion
        nuevo_cliente = request.POST.get('nuevo_cliente', False)
        cliente_nombre = request.POST.get('cliente_nombre', None)
        cliente_nit = request.POST.get('cliente_nit', None)
        cliente_id = request.POST.get('cliente', None)
        nombres = request.POST.get('nombres', None)
        apellidos = request.POST.get('apellidos', None)
        correo_electronico = request.POST.get('correo_electronico', None)
        correo_electronico_2 = request.POST.get('correo_electronico_2', None)
        pais = request.POST.get('pais', None)
        ciudad = request.POST.get('ciudad', None)
        cargo = request.POST.get('cargo', None)
        telefono = request.POST.get('telefono', None)
        telefono_2 = request.POST.get('telefono_2', None)
        contacto = contacto_cliente_crear_desde_cotizacion(
            nuevo_cliente=nuevo_cliente,
            creado_por_id=self.request.user.id,
            cliente_nombre=cliente_nombre,
            cliente_nit=cliente_nit,
            cliente_id=cliente_id,
            nombres=nombres,
            apellidos=apellidos,
            correo_electronico=correo_electronico,
            correo_electronico_2=correo_electronico_2,
            pais=pais,
            ciudad=ciudad,
            cargo=cargo,
            telefono=telefono,
            telefono_2=telefono_2
        )
        serializer = self.get_serializer(contacto)
        return Response(serializer.data)
