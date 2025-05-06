import logging

from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from rest_framework import routers

from core.views import EventViewSet, TaskViewSet, MessageViewSet

# Logger for CSRF endpoint debugging
logger = logging.getLogger('django')

@ensure_csrf_cookie
def get_csrf_token(request):
    origin = request.META.get('HTTP_ORIGIN')
    logger.debug("🔥 Incoming Origin header: %s", origin)
    return JsonResponse({'detail': 'CSRF cookie set'})

@login_required
def get_user_info(request):
    # Add authentication check
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    return JsonResponse({
        'username': request.user.username,
        'email': request.user.email
    })

router = routers.DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/csrf/', get_csrf_token),
    # Move api-auth to before other patterns to ensure login is handled first
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-auth/user/', get_user_info),
]

from django.conf import settings
from django.conf.urls.static import static

# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)