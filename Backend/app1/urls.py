from django.urls import path
from .views import register_or_login, create_or_join_room, get_messages
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns=[
    path('auth/', register_or_login, name='register_or_login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('room/',create_or_join_room, name='create_or_join_room'),
    path('messages/', get_messages, name='get_messages')

]

