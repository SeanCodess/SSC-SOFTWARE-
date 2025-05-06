from rest_framework import serializers
from .models import Event, Task, Message

class TaskSerializer(serializers.ModelSerializer):
    # show who owns it, but don't let the client override
    user = serializers.StringRelatedField(read_only=True)
    # allow the client to pass an event ID (or omit for standalone tasks)
    event = serializers.PrimaryKeyRelatedField(
        queryset=Event.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = [
            'id',
            'event',
            'title',
            'description',
            'due_date',
            'completed',
            'user',
        ]
        read_only_fields = ['user']


class EventSerializer(serializers.ModelSerializer):
    # include nested tasks under each event
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'start',
            'end',
            'organizer',
            'tasks',
        ]
        read_only_fields = ['organizer']


class MessageSerializer(serializers.ModelSerializer):
    # show the username, set by the view
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Message
        fields = [
            'id',
            'room_name',
            'user',
            'content',
            'timestamp',
        ]
        read_only_fields = ['user', 'timestamp']

    def validate_room_name(self, value):
        if not value:
            return 'general'
        return value
