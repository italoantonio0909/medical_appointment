import datetime
from datetime import timedelta
from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.appointment.models import Appointment, Specialty
from medical_appointment.appointment.services import (appointment_accept,
                                                      appointment_create,
                                                      appointment_delete,
                                                      specialty_create)
from medical_appointment.common.test_utils import fake
from medical_appointment.users.services import user_create


class AppointmentAcceptTest(TestCase):
    def setUp(self):
        self.service = appointment_accept

    @patch('medical_appointment.appointment.services.appointment_delete')
    def test_when_has_already_been_reused(self, appointment_delete_mock):
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
        # Add day
        current_date = datetime.date.today()
        add_day = timedelta(days=1)
        date = current_date + add_day

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(10, 30, 00)

        # Appointment return dict()
        appointment_create(
            user=user.id,
            specialty=Specialty.objects.first().id,
            date=date,
            time=time
        )

        self.assertEqual(1, Appointment.objects.count())

        # Delete appoinment
        appointment_delete(
            user_id=user.id,
            appointment_id=Appointment.objects.first().id
        )

        # Create a user per reused appointment
        new_user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()

        )

        # Reused appointment with rejected=True
        self.service(
            user_id=new_user.id,
            appointment_id=Appointment.objects.first().id
        )

        self.assertEqual(1, Appointment.objects.count())

        # Reused appointment with rejected=False
        # Should raise ValidationError
        with self.assertRaises(ValidationError):
            self.service(
                user_id=new_user.id,
                appointment_id=Appointment.objects.first().id
            )

        self.assertEqual(1, Appointment.objects.count())
