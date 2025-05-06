from django.contrib import admin
from .models import Event, Task, Message

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'start', 'end', 'organizer']
    search_fields = ['title', 'description']
    list_filter = ['start', 'organizer']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'event', 'user', 'due_date', 'completed']
    list_filter = ['completed', 'user', 'event']
    search_fields = ['title', 'description']

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['room_name', 'user', 'content', 'timestamp']
    list_filter = ['room_name', 'user']
    search_fields = ['content']
