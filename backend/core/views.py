from datetime import timedelta
import logging

from django.utils import timezone
from django.db.models import Q  # Add this import
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated

from .models import Event, Task, Message
from .serializers import EventSerializer, TaskSerializer, MessageSerializer
from .tasks import send_event_reminder, send_task_reminder

# Logger for debug testing
logger = logging.getLogger('django')

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['start', 'end']
    ordering = ['start']

    def get_queryset(self):
        # Show events where user is organizer or has related tasks
        return Event.objects.filter(
            Q(organizer=self.request.user) |  # Remove models. prefix
            Q(tasks__user=self.request.user)  # Remove models. prefix
        ).distinct()

    def list(self, request, *args, **kwargs):
        logger.debug(
            "🐛 EventViewSet.list called, path=%s, user=%s",
            request.path,
            request.user
        )
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        # fixed: use self.request.user instead of undefined request
        logger.debug(
            "🐛 EventViewSet.perform_create called, user=%s",
            self.request.user
        )
        event = serializer.save(organizer=self.request.user)
        remind_at = event.start - timedelta(hours=24)
        if remind_at > timezone.now():
            send_event_reminder.apply_async(
                args=(event.id,),
                eta=remind_at
            )

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['due_date']
    ordering = ['due_date']

    def get_queryset(self):
        # Only show tasks assigned to the current user
        return Task.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        logger.debug(
            "🐛 TaskViewSet.list called, path=%s, user=%s",
            request.path,
            request.user
        )
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        # fixed: use self.request.user and correct FK field name 'user'
        logger.debug(
            "🐛 TaskViewSet.perform_create called, user=%s",
            self.request.user
        )
        task = serializer.save(user=self.request.user)
        remind_at = task.due_date - timedelta(hours=1)
        if remind_at > timezone.now():
            send_task_reminder.apply_async(
                args=(task.id,),
                eta=remind_at
            )

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering = ['-timestamp']

    def get_queryset(self):
        # Filter messages by room_name if provided
        room_name = self.request.query_params.get('room_name', None)
        queryset = Message.objects.all()
        if room_name:
            queryset = queryset.filter(room_name=room_name)
        return queryset

    def list(self, request, *args, **kwargs):
        logger.debug(
            "🐛 MessageViewSet.list called, path=%s, user=%s",
            request.path,
            request.user
        )
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        logger.debug(
            "🐛 MessageViewSet.perform_create called, user=%s",
            self.request.user
        )
        serializer.save(user=self.request.user)
