import datetime
from datetime import timedelta
from unittest.mock import patch

from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.appointment.models import AppointmentAssign
from medical_appointment.appointment.services import appointment_assign_create,specialty_create
from medical_appointment.common.test_utils import fake
from medical_appointment.users.services import user_create_superuser


class AppointmentAsignCreateTest(TestCase):
    def setUp(self):
        # Create superuser
        self.superuser = user_create_superuser(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )
        # Invoque service test
        self.service = appointment_assign_create

    @patch('medical_appointment.appointment.services.appointment_assign_create')
    def test_non_avaible_hours(self, appointment_assign_create_mock):
        # Add one day to current date 2021-04-21 -> 2021-04-22
        current_date = datetime.date.today()
        date = current_date + timedelta(days=1)

        # Set hour not working -> range 8:00:00 - 16:00:00
        time = datetime.time(19, 30, 00)

        with self.assertRaises(ValidationError):
            # Invoque service with hours not working
            self.service(
                user=self.superuser.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_assign_create')
    def test_non_avaible_month(self, appointment_assign_create_mock):

        # Subtract a month 2021-04-21 -> 2021-03-22
        current_date = datetime.date.today()
        substract_month = relativedelta(months=1)
        date = current_date - substract_month

        # Set hour not working -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 30, 00)

        with self.assertRaises(ValidationError):
            self.service(
                user=self.superuser.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_assign_create')
    def test_non_avaible_lower_year(self, appointment_assign_create_mock):

        # Subtract a year 2021-04-21 -> 2020-04-22
        current_date = datetime.date.today()
        substract_year = relativedelta(years=1)
        date = current_date - substract_year

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 30, 00)

        with self.assertRaises(ValidationError):
            self.service(
                user=self.superuser.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_assign_create')
    def test_non_avaible_upper_year(self, appointment_assign_create_mock):

        # Add a year 2021-04-21 -> 2022-04-22
        current_date = datetime.date.today()
        add_year = relativedelta(years=1)
        date = current_date + add_year

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 30, 00)

        with self.assertRaises(ValidationError):
            self.service(
                user=self.superuser.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_assign_create')
    def test_invalid_range_minutes(self, appointment_assign_create_mock):

        # Add day 2021-04-21 -> 2022-04-22
        current_date = datetime.date.today()
        date = current_date + timedelta(days=1)

        # Set hour not working -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 45, 00)

        with self.assertRaises(ValidationError):
            self.service(
                user=self.superuser.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_assign_create')
    def test_invalid_day_in_current_month(self, appointment_assign_create_mock):
        # Abstract day 2021-04-21 -> 2022-04-20
        current_date = datetime.date.today()
        substract_day = timedelta(days=1)
        date = current_date - substract_day

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 30, 00)

        with self.assertRaises(ValidationError):
            self.service(
                user=self.superuser.id,
                time=time,
                date=date
            )

    @patch('medical_appointment.appointment.services.appointment_assign_create')
    def test_appointment_assign_already_exists(self, appointment_assign_create_mock):

        # Add day 2021-04-21 -> 2022-04-20
        current_date = datetime.date.today()
        date = current_date + timedelta(days=1)

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 30, 00)

        self.service(
            user=self.superuser.id,
            date=date,
            time=time
        )

        self.assertEqual(1, AppointmentAssign.objects.count())

        # Create a appointment assign with the same date
        # Should raise ValidationError
        with self.assertRaises(ValidationError):
            self.service(
                user=self.superuser.id,
                date=date,
                time=time
            )

        self.assertEqual(1, AppointmentAssign.objects.count())
