from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from django_celery_beat.models import (CrontabSchedule, IntervalSchedule,
                                       PeriodicTask)
from medical_appointment.common.test_utils import fake
from medical_appointment.tasks.services import task_setup_periodic
from medical_appointment.tasks.tasks import task_appointment_remember


class SetupPeriodicTasksTest(TestCase):
    def setUp(self):
        self.service = task_setup_periodic

    @patch('medical_appointment.tasks.services.task_setup_periodic')
    def test_service_return_nothing_when_empty_tasks(self, task_setup_periodic_mock):
        result = self.service(tasks=[])
        self.assertEqual([], result)

    @patch('medical_appointment.tasks.services.task_setup_periodic')
    def test_service_save_tasks(self, task_setup_periodic_mock):
        periodic_tasks_data = [
            {
                'task': task_appointment_remember,
                'name': fake.bothify(text='Task number: ????-###'),
                'cron': {
                    'hour': str(fake.random_digit()),
                    'minute': str(fake.random_digit()),
                    'day_of_week': '*',
                    'day_of_month': '*',
                    'month_of_year': '*',
                    'timezone': 'America/Guayaquil'
                },
                'enabled': True
            },
        ]

        result = self.service(tasks=periodic_tasks_data)
        self.assertEqual(len(periodic_tasks_data), len(result))

        # Check database
        periodic_task = PeriodicTask.objects.all()
        crontab_task = CrontabSchedule.objects.all()

        # Not match with empty data
        self.assertNotEqual([], list(periodic_task))
        self.assertNotEqual([], list(crontab_task))

    @patch('medical_appointment.tasks.services.task_setup_periodic')
    def test_param_task_is_not_a_function(self, task_setup_periodic_mock):

        # Set data with param task type String
        # Should be a function param
        # task_appointment_remember
        # <@task: medical_appointment.tasks.tasks.task_appointment_remember at 0x4284970>
        periodic_tasks_data = [
            {
                'task': 'task_appointment_remember',
                'name': 'Appointment remember',
                'cron': {
                    'hour': str(fake.random_digit()),
                    'minute': str(fake.random_digit()),
                    'day_of_week': '*',
                    'day_of_month': '*',
                    'month_of_year': '*',
                    'timezone': 'America/Guayaquil'
                },
                'enabled': True
            },
        ]

        for task in periodic_tasks_data:
            # Check if param task is a function
            result = hasattr(task.get('task'), '__call__')
            self.assertFalse(result)
