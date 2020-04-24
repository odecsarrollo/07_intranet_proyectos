from django.urls import path

from .views import (
    IndexView
)

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('app/*', IndexView.as_view(), name='index'),
]
