from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email= models.EmailField(unique=True)

    def __str__(self):
        return self.username
    
class Room(models.Model):
    name=models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Message(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_messages')
    room=models.ForeignKey(Room, on_delete=models.CASCADE , related_name='room_messages')
    content=models.TextField()
    timestamp=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.email}: {self.content[:20]}"