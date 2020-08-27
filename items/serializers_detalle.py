# Se crea para evitar referencia circular con Bandas Eurobelt
from bandas_eurobelt.serializers import CategoriaDosSerializer
from bandas_eurobelt.serializers import TipoBandaSerializer
from items.serializers import CategoriaProductoSerializer


class CategoriaProductoConDetalleSerializer(CategoriaProductoSerializer):
    tipos_eurobelt = TipoBandaSerializer(many=True, read_only=True, context={'quitar_campos': ['categorias']})
    categorias_dos_eurobelt = CategoriaDosSerializer(many=True, read_only=True,
                                                     context={'quitar_campos': ['categorias']})
