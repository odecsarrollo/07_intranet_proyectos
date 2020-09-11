from .api_routers import DefaultRouter
from proyectos.urls import router as proyectos_router
from cguno.api_urls import router as cguno_router
from permisos.urls import router as permisos_router
from mano_obra.urls import router as mano_obra_router
from usuarios.urls import router as usuarios_router
from clientes.urls import router as clientes_router
from cotizaciones.urls import router as cotizaciones_router
from configuraciones.urls import router as configuracion_costos_router
from proyectos_seguimientos.urls import router as proyectos_seguimientos_router
from bandas_eurobelt.urls import router as banda_eurobelt_router
from sistema_informacion_origen.urls import router as sistema_informacion_origen_router
from geografia.urls import router as geografia_router
from cargues_catalogos.urls import router as cargues_catalogos_router
from importaciones.urls import router as importaciones_router
from items.urls import router as items_router
from listas_precios.urls import router as listas_precios_router
from catalogo_productos.urls import router as catalogo_productos_router
from medios_adhesivos.urls import router as medios_adhesivos_router
from contabilidad_anticipos.urls import router as contabilidad_anticipos_router
from sistemas_equipos.urls import router as sistemas_equipos_router
from cotizaciones_componentes.urls import router as cotizaciones_componentes_router
from correos_servicios.urls import router as correos_servicios_router
from colaboradores.urls import router as colaboradores_router
from cargues_detalles.urls import router as cargues_detalles_router
from proyectos_equipos.urls import router as proyectos_equipos_router
from postventa.urls import router as postventa_router
from documentaciones_procesos.urls import router as documentaciones_procesos_router

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
router.extend(medios_adhesivos_router)
router.extend(contabilidad_anticipos_router)
router.extend(sistemas_equipos_router)
router.extend(cotizaciones_componentes_router)
router.extend(correos_servicios_router)
router.extend(colaboradores_router)
router.extend(cargues_detalles_router)
router.extend(proyectos_equipos_router)
router.extend(postventa_router)
router.extend(documentaciones_procesos_router)
