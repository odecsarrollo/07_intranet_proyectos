"""intranet_proyectos URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from .api_urls import router
from index.views import IndexView
from knox.views import LogoutView
import requests

from .views import send_emails


def proxy_to_webpack_dev_server(request, path):
    """Proxy requests to webpack-dev-server for sockjs-node and hot reload"""
    try:
        url = f'http://127.0.0.1:3000/sockjs-node/{path}'
        # Get query parameters from request
        query_string = request.META.get('QUERY_STRING', '')
        if query_string:
            url = f'{url}?{query_string}'
        
        # Get origin from request
        origin = request.META.get('HTTP_ORIGIN', '')
        if not origin:
            # Fallback to request host if no origin header
            origin = f"http://{request.get_host()}"
        
        response = requests.get(
            url,
            headers={
                'Host': 'localhost:3000',
                'Origin': origin,
                'Referer': request.META.get('HTTP_REFERER', ''),
            },
            timeout=5
        )
        
        django_response = HttpResponse(
            content=response.content,
            status=response.status_code,
            content_type=response.headers.get('Content-Type', 'application/json')
        )
        
        # Add CORS headers - must specify exact origin when using credentials
        django_response['Access-Control-Allow-Origin'] = origin
        django_response['Access-Control-Allow-Credentials'] = 'true'
        django_response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        django_response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        
        return django_response
    except requests.exceptions.RequestException as e:
        # If webpack-dev-server is not running, return 404 with CORS headers
        origin = request.META.get('HTTP_ORIGIN', '')
        if not origin:
            origin = f"http://{request.get_host()}"
        response = HttpResponse(status=404)
        response['Access-Control-Allow-Origin'] = origin
        response['Access-Control-Allow-Credentials'] = 'true'
        return response


urlpatterns = [
    re_path(r'^send_emails$', send_emails),
    path('admin/', admin.site.urls),
    path('api/auth/logout', LogoutView.as_view()),
    path('api/', include(router.urls)),
    re_path(r'^app/*', IndexView.as_view(), name='index'),
    path('', include('index.urls')),
    re_path(r'^silk/', include(('silk.urls', 'silk'), namespace='silk')),
]

if settings.DEBUG:
    # Proxy sockjs-node and webpack-dev-server requests to webpack-dev-server
    urlpatterns += [
        re_path(r'^sockjs-node/(?P<path>.*)$', proxy_to_webpack_dev_server, name='sockjs-proxy'),
        re_path(r'^webpack-dev-server/(?P<path>.*)$', proxy_to_webpack_dev_server, name='webpack-proxy'),
    ]
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
