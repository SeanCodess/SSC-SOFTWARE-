from datetime import timedelta
import logging

from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Event, Task, Message
from .serializers import EventSerializer, TaskSerializer, MessageSerializer
from .tasks import send_event_reminder, send_task_reminder

# Logger for debug testing
logger = logging.getLogger('django')

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('start')
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

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
    queryset = Task.objects.all().order_by('due_date')
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

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
    queryset = Message.objects.all().order_by('timestamp')
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

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
            request.user
        )
        serializer.save(user=request.user)
