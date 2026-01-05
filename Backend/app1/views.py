from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import User, Room, Message
from .serializers import Userserializer
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .logindecorator import tiken_sortcut
# Create your views here.



def get_tokens_for_user(user):
    refresh=RefreshToken.for_user(user)
    return {
        "re":str(refresh),
        "ac":str(refresh.access_token)
    }

@csrf_exempt
@tiken_sortcut
@api_view(['POST'])
def register_or_login(request):
    username=request.data.get('username')
    password=request.data.get('password')
    email=request.data.get('email')
    if not username or not password or not email:
        return Response({"error":"all field required"}, status=status.HTTP_400_BAD_REQUEST)
    user=User.objects.filter(email=email).first()
    if user:
        if user.check_password(password):
            tokens=get_tokens_for_user(user)
            return Response({"message":"login complete",
                             "tokens":tokens,
                             "user":{
                                 "id":user.id,
                                 "username":user.username,
                                 "email":user.email
                             }}, status=status.HTTP_200_OK)
        else:
            return Response({"error":"invalid password"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        new_user=User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        tokens=get_tokens_for_user(new_user)
        return Response({"message":"registration complete",
                         "tokens":tokens,
                         "user":{
                             "id":new_user.id,
                             "username":new_user.username,
                             "email":new_user.email,
                         },
                         "status":True,
                         },status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected(request):
    user=request.user
    return Response({"message":"welcome back",
                    "user":{
                        "id":user.id,
                        "username":user.username,
                        "email":user.email
                    }},status=status.HTTP_200_OK)


@api_view(['POST'])
def create_or_join_room(request):
    room_name = request.data.get('room_name')
    room, created = Room.objects.get_or_create(name=room_name)
    return Response(
        {"room": room.name, "created": created},
        status=status.HTTP_200_OK
    )


def get_messages(request):
    room_name = request.GET.get('room_name')   # FIXED 🔥

    if not room_name:
        return JsonResponse({"error": "room_name is required"}, status=400)

    room = get_object_or_404(Room, name=room_name)

    messages = Message.objects.filter(room=room).order_by('timestamp')

    message_list = [
        {
            'user_id': msg.user.email,
            'content': msg.content,
            'timestamp': msg.timestamp
        }
        for msg in messages
    ]

    return JsonResponse(message_list, safe=False)

    
