from .api_routers import DefaultRouter
from proyectos.api_urls import router as proyectos_router
from cguno.api_urls import router as cguno_router

router = DefaultRouter()
router.extend(proyectos_router)
router.extend(cguno_router)
