"""
ASGI config for final project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from app1.routing import websocket_urlpatterns
from django.core.asgi import get_asgi_application
from app1.middleware import JWTAuthMiddleware
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "final.settings")

django.setup()
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns)
        )
    ),
})
print("🚀 ASGI Loaded with WebSocket Routing")

