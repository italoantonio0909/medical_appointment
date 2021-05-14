import datetime
from datetime import timedelta
from unittest.mock import patch

from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.appointment.models import Appointment, Specialty
from medical_appointment.appointment.services import (appointment_create,
                                                      appointment_remember,
                                                      specialty_create)
from medical_appointment.common.test_utils import fake
from medical_appointment.users.services import user_create


class AppointmentCreateTest(TestCase):
    def setUp(self):
        # Create a user
        self.user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )

        specialty_create(
            title=fake.bothify(text='Specialty ????-###'))

        # Invoque service test
        self.service = appointment_remember

    @patch('medical_appointment.appointment.services.appointment_remember')
    def test_not_data_appointment_per_today(self, appointment_remember_mock):
        appointments = self.service()

        # Tranform <[QuerySet[]> to list -> []
        self.assertEqual( [], list(appointments))

    @patch('medical_appointment.appointment.services.appointment_remember')
    def test_service_find_appointment_per_today(self, appointment_remember_mock):
        # Current date and set new days -> timedelta
        current_date = datetime.date.today()

        date_one = current_date + timedelta(days=1)
        date_two = current_date + timedelta(days=2)

        # Set hour -> range 8:00:00 - 16:00:00
        time_one = datetime.time(10, 00, 00)
        time_two = datetime.time(10, 30, 00)

        data = [
            {
                'date': date_one,
                'time': time_one
            },
            {
                'date': date_two,
                'time': time_two
            }
        ]
        for e in data:
            appointment_create(
                specialty=Specialty.objects.first().id,
                user=self.user.id,
                date=e.get('date'),
                time=e.get('time')
            )

        self.assertEqual(len(data), Appointment.objects.count())

        # Invoque service
        result = self.service()

        # Array result has contain elements
        # [] -> False
        # [<QuerySet[Appointment:{}]>] ->True
        self.assertTrue(result)
