from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Room, Message, User
import redis
r=redis.Redis(host='127.0.0.1', port=6379, db=0)


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope["user"]:
            await self.close()
            return
        self.room_name=self.scope['url_route']['kwargs']['room_name']
        self.room_group=f"chat_{self.room_name}"
        emai=self.scope['user'].email
        channel=self.channel_name
        r.sadd(f"online_user:{emai}", channel)

        await self.channel_layer.group_add(
            self.room_group,
            self.channel_name
        )

        await self.accept()
        await self.channel_layer.group_send(
            self.room_group,
            {
                'type': 'online_update',
            }
        )

    async def disconnect(self, code):
        emai=self.scope['user'].email
        channel=self.channel_name
        r.srem(f"online_user:{emai}", channel)
        if r.scard(f"online_user:{emai}")==0:
            r.delete(f"online_user:{emai}")
        await self.channel_layer.group_discard(
            self.room_group,
            self.channel_name
        )
        await self.channel_layer.group_send(
            self.room_group,
            {
                'type':'online_update'
            }
        )

    async def receive(self,text_data):
        try:
            data=json.loads(text_data)
            message=data['message']
            user=self.scope['user']
            await self.save_message(user, self.room_name, message)
            await self.channel_layer.group_send(
            self.room_group,
            {
                'type':'chat_message',
                'message': message,
                'user': user.email
            }
        )
        except Exception as e:
            print(f"Error: {e}")
    
    async def chat_message(self, event):
        message=event['message']
        user=event['user']
        await self.send(text_data=json.dumps({
            'message': message,
            'user': user
        }))



    @database_sync_to_async
    def save_message(self, user, room_name, message):
        try:
            room=Room.objects.get(name=room_name)
            Message.objects.create(user=user, room=room, content=message)
        except Room.DoesNotExist:
            print(f"Room {room_name} does not exist")

    async def online_update(self, event):
        keys = r.keys("online_user:*")
        online_users = [key.decode().replace("online_user:", "") for key in keys]

        await self.send(text_data=json.dumps({
            "online": online_users
        }))
