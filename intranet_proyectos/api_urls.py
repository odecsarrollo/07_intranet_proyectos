from .api_routers import DefaultRouter
from proyectos.api_urls import router as proyectos_router
from cguno.api_urls import router as cguno_router
from permisos.api_urls import router as permisos_router

router = DefaultRouter()
router.extend(proyectos_router)
router.extend(cguno_router)
router.extend(permisos_router)
