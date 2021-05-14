from django.core.management.base import BaseCommand
from django.db import transaction
from medical_appointment.tasks.services import task_setup_periodic
from medical_appointment.tasks.tasks import task_appointment_remember


class Command(BaseCommand):
    """This command allow setup tasks in database


    Parameters:
    periodic_tasks_data --  List tasks with aditional information
    """

    help = 'Setup celery beat periodic tasks and save.'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        periodic_tasks_data = [
            {
                'task': task_appointment_remember,
                'name': 'Appointment remember',
                'cron': {
                    'hour': '22',
                    'minute': '30',
                    'day_of_week': '*',
                    'day_of_month': '*',
                    'month_of_year': '*',
                    'timezone': 'America/Guayaquil'
                },
                'enabled': True
            },
        ]

        task_setup_periodic(tasks=periodic_tasks_data)
