import jwt
from django.conf import settings
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from channels.middleware import BaseMiddleware
from .models import User

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None



class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        quary_string=scope['query_string'].decode()

        token=None
        if 'token=' in quary_string:
            token=quary_string.split('token=')[-1]
            if token:
                try:
                    access_token=AccessToken(token)
                    user=await get_user(access_token['user_id'])
                    scope['user']=user
                except Exception:
                    scope['user']=None
            else:
                scope['user']=None
            return await super().__call__(scope, receive, send)

