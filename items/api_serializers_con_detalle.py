from .api_serializers import CategoriaProductoSerializer
from bandas_eurobelt.api_serializers import TipoBandaSerializer, CategoriaDosSerializer


class CategoriaProductoConDetalleSerializer(CategoriaProductoSerializer):
    #tipos_eurobelt = TipoBandaSerializer(many=True, read_only=True, context={'quitar_campos': ['categorias']})
    categorias_dos_eurobelt = CategoriaDosSerializer(many=True, read_only=True,
                                                     context={'quitar_campos': ['categorias']})
