from .api_routers import DefaultRouter
from proyectos.api_urls import router as proyectos_router
from cguno.api_urls import router as cguno_router
from permisos.api_urls import router as permisos_router
from mano_obra.api_urls import router as mano_obra_router
from usuarios.api_urls import router as usuarios_router
from clientes.api_urls import router as clientes_router
from cotizaciones.api_urls import router as cotizaciones_router
from configuraciones.api_urls import router as configuracion_costos_router
from proyectos_seguimientos.api_urls import router as proyectos_seguimientos_router
from bandas_eurobelt.api_urls import router as banda_eurobelt_router
from sistema_informacion_origen.api_urls import router as sistema_informacion_origen_router
from geografia.api_urls import router as geografia_router
from cargues_catalogos.api_urls import router as cargues_catalogos_router
from importaciones.api_urls import router as importaciones_router
from items.api_urls import router as items_router
from listas_precios.api_urls import router as listas_precios_router
from catalogo_productos.api_urls import router as catalogo_productos_router
from medios_etiquetas.api_urls import router as medios_etiquetas_router

router = DefaultRouter()
router.extend(proyectos_router)
router.extend(cguno_router)
router.extend(permisos_router)
router.extend(mano_obra_router)
router.extend(usuarios_router)
router.extend(clientes_router)
router.extend(cotizaciones_router)
router.extend(configuracion_costos_router)
router.extend(proyectos_seguimientos_router)
router.extend(banda_eurobelt_router)
router.extend(sistema_informacion_origen_router)
router.extend(geografia_router)
router.extend(cargues_catalogos_router)
router.extend(importaciones_router)
router.extend(items_router)
router.extend(listas_precios_router)
router.extend(catalogo_productos_router)
router.extend(medios_etiquetas_router)