from rest_framework import routers
from .api_views import ColaboradorViewSet

router = routers.DefaultRouter()
router.register(r'colaboradores_colaboradores', ColaboradorViewSet)
