import datetime
from datetime import timedelta
from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.appointment.models import Appointment, Specialty
from medical_appointment.appointment.selectors import appointment_by_id
from medical_appointment.appointment.services import (appointment_create,
                                                      specialty_create)
from medical_appointment.common.test_utils import fake
from medical_appointment.users.services import user_create


class AppointmentByIdTest(TestCase):
    def setUp(self):
        self.selector = appointment_by_id

    @patch('medical_appointment.appointment.selectors.appointment_by_id')
    def test_selector_return_nothing(self, appointment_by_id_mock):
        with self.assertRaises(ValidationError):
            self.selector(id=fake.random_digit())

    @patch('medical_appointment.appointment.selectors.appointment_by_id')
    def test_selector_return_appointment(self, appointment_by_id):

        # Create user
        user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )

        # Create specialty
        specialty_create(
            title=fake.bothify(text='Specialty ????-###'))

        # Create appointment
        # Add day to date
        current_date = datetime.date.today()
        add_day = timedelta(days=1)
        date = current_date + add_day

        # Set hour-> range 8:00:00 - 16:00:00
        time = datetime.time(10, 30, 00)

        appointment = appointment_create(
            specialty=Specialty.objects.first().id,
            user=user.id,
            date=date,
            time=time
        )

        appointment_id = Appointment.objects.first().id 
        result = self.selector(id=appointment_id)
    
        # Match appointment with database
        self.assertNotEqual([], [result])


