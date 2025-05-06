from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start       = models.DateTimeField()
    end         = models.DateTimeField(null=True, blank=True)
    organizer   = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Task(models.Model):
    event     = models.ForeignKey(
                  Event,
                  related_name='tasks',
                  on_delete=models.CASCADE,
                  null=True,
                  blank=True
                )
    title     = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user      = models.ForeignKey(
                  User,
                  on_delete=models.CASCADE
                )
    due_date  = models.DateTimeField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        status = '✔' if self.completed else '❌'
        return f"{self.title} ({status})"


class Message(models.Model):
    room_name = models.CharField(max_length=50)  # e.g. "general" or an Event ID
    user      = models.ForeignKey(User, on_delete=models.CASCADE)
    content   = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.room_name}] {self.user.username}: {self.content[:20]}"
