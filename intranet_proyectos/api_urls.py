from .api_routers import DefaultRouter
from proyectos.api_urls import router as proyectos_router
from cguno.api_urls import router as cguno_router
from permisos.api_urls import router as permisos_router
from mano_obra.api_urls import router as mano_obra_router
from usuarios.api_urls import router as usuarios_router
from clientes.api_urls import router as clientes_router
from cotizaciones.api_urls import router as cotizaciones_router
from configuraciones.api_urls import router as configuracion_costos_router
from listados_materiales.api_urls import router as listados_materiales_router

router = DefaultRouter()
router.extend(proyectos_router)
router.extend(cguno_router)
router.extend(permisos_router)
router.extend(mano_obra_router)
router.extend(usuarios_router)
router.extend(clientes_router)
router.extend(cotizaciones_router)
router.extend(configuracion_costos_router)
router.extend(listados_materiales_router)
