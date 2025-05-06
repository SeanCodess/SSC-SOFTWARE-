# core/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from .models import Task, Event

@shared_task
def send_task_reminder(task_id):
    try:
        t = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return

    # e.g. email reminder
    send_mail(
        subject=f"Reminder: Task due soon: {t.title}",
        message=f"Your task “{t.title}” is due at {t.due}.",
        from_email="noreply@ssc.local",
        recipient_list=[t.assignee.email],
    )

@shared_task
def send_event_reminder(event_id):
    try:
        e = Event.objects.get(pk=event_id)
    except Event.DoesNotExist:
        return

    send_mail(
        subject=f"Reminder: Upcoming event: {e.title}",
        message=f"Event “{e.title}” starts at {e.start}.",
        from_email="noreply@ssc.local",
        recipient_list=[e.organizer.email],
    )
