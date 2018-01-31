from .api_routers import DefaultRouter
from proyectos.api_urls import router as proyectos_router

router = DefaultRouter()
router.extend(proyectos_router)
