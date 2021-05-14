import datetime
from datetime import timedelta
from unittest.mock import patch

from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.appointment.models import (Appointment,
                                                    Specialty)
from medical_appointment.appointment.services import (appointment_create,
                                                      appointment_delete,
                                                      specialty_create)
from medical_appointment.common.test_utils import fake
from medical_appointment.users.services import user_create


class AppointmentDeleteTest(TestCase):
    def setUp(self):
        # Create a user
        self.user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )
        self.service = appointment_delete

    @patch('medical_appointment.appointment.services.appointment_delete')
    def test_service_reject_true(self, appointment_delete_mock):
        # Create a specialty
        specialty_create(
            title=fake.bothify(text='Specialty ????-###'))

        # Create a appointment
        # Add day to date
        current_date = datetime.date.today()
        add_day = timedelta(days=1)
        date = current_date + add_day

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(10, 30, 00)

        # Appointment return dict
        appointment = appointment_create(
            specialty=Specialty.objects.first().id,
            user=self.user.id,
            date=date,
            time=time
        )

        self.assertEqual(1, Appointment.objects.count())

        self.service(
            user_id=self.user.id,
            appointment_id=appointment.get('id')
        )

        self.assertEqual(1, Appointment.objects.count())
        self.assertTrue(Appointment.objects.first().rejected)

        # Delete a appointment with rejected=True
        # Should raise ValidationError
        with self.assertRaises(ValidationError):
            self.service(
                user_id=self.user.id,
                appointment_id=appointment.get('id')
            )

    @patch('medical_appointment.appointment.services.appointment_delete')
    def test_service_appointment_not_found(self, appointment_delete_mock):
        with self.assertRaises(ValidationError):
            self.service(
                user_id=self.user.id,
                appointment_id=1
            )
