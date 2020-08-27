from rest_framework import routers
from .views import ColaboradorViewSet

router = routers.DefaultRouter()
router.register(r'colaboradores_colaboradores', ColaboradorViewSet)
