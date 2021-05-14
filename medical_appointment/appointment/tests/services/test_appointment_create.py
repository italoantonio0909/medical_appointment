import datetime
from datetime import timedelta
from unittest.mock import patch

from dateutil.relativedelta import relativedelta
from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.appointment.models import (Appointment,
                                                    AppointmentAssign,
                                                    Specialty)
from medical_appointment.appointment.services import (
    appointment_assign_create, appointment_create, specialty_create)
from medical_appointment.common.test_utils import fake
from medical_appointment.users.services import (user_create,
                                                user_create_superuser)


class AppointmentCreateTest(TestCase):
    def setUp(self):
        # Create superuser
        self.superuser = user_create_superuser(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )

        # Create a user
        self.user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )
        specialty_create(title=fake.bothify(text='Specialty ????-###'))

        # Invoque service test
        self.service = appointment_create

    @patch('medical_appointment.appointment.services.appointment_create')
    def test_non_avaible_hours(self, appointment_create_mock):
        # Add one day to current date 2021-04-21 -> 2021-04-22
        current_date = datetime.date.today()
        date = current_date + timedelta(days=1)

        # Set hour not working -> range 8:00:00 - 16:00:00
        time = datetime.time(19, 30, 00)

        with self.assertRaises(ValidationError):
            # Invoque service with hours not working
            self.service(
                specialty=Specialty.objects.first().id,
                user=self.user.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_create')
    def test_non_avaible_month(self, appointment_create_mock):

        # Subtract a month 2021-04-21 -> 2021-03-22
        current_date = datetime.date.today()
        substract_month = relativedelta(months=1)
        date = current_date - substract_month

        # Set hour not working -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 30, 00)

        with self.assertRaises(ValidationError):
            self.service(
                specialty=Specialty.objects.first().id,
                user=self.user.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_create')
    def test_non_avaible_lower_year(self, appointment_create_mock):

        # Subtract a year 2021-04-21 -> 2020-04-22
        current_date = datetime.date.today()
        substract_year = relativedelta(years=1)
        date = current_date - substract_year

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 30, 00)

        with self.assertRaises(ValidationError):
            self.service(
                specialty=Specialty.objects.first().id,
                user=self.user.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_create')
    def test_non_avaible_upper_year(self, appointment_create_mock):

        # Add a year 2021-04-21 -> 2022-04-22
        current_date = datetime.date.today()
        add_year = relativedelta(years=1)
        date = current_date + add_year

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 30, 00)

        with self.assertRaises(ValidationError):
            self.service(
                specialty=Specialty.objects.first().id,
                user=self.user.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_create')
    def test_invalid_range_minutes(self, appointment_create_mock):

        # Add day 2021-04-21 -> 2022-04-22
        current_date = datetime.date.today()
        date = current_date + timedelta(days=1)

        # Set hour not working -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 45, 00)

        with self.assertRaises(ValidationError):
            self.service(
                specialty=Specialty.objects.first().id,
                user=self.user.id,
                date=date,
                time=time
            )

    @patch('medical_appointment.appointment.services.appointment_create')
    def test_invalid_day_in_current_month(self, appointment_create_mock):
        # Abstract day 2021-04-21 -> 2022-04-20
        current_date = datetime.date.today()
        substract_day = timedelta(days=1)
        date = current_date - substract_day

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(13, 30, 00)

        with self.assertRaises(ValidationError):
            self.service(
                user=self.user.id,
                specialty=Specialty.objects.first().id,
                time=time,
                date=date
            )

    @patch('medical_appointment.appointment.services.appointment_create')
    def test_already_appointment(self, appointment_create_mock):

        # Add day
        current_date = datetime.date.today()
        add_day = timedelta(days=1)
        date = current_date + add_day

        # Set hour -> range 8:00:00 - 16:00:00
        time = datetime.time(10, 30, 00)

        # Create a appointment
        appointment = self.service(
            user=self.user.id,
            specialty=Specialty.objects.first().id,
            time=time,
            date=date
        )

        # Match appointment with count database
        self.assertEqual(1, Appointment.objects.count())

        # Create a new user
        new_user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )

        # Invoque service with same time and data
        with self.assertRaises(ValidationError):
            self.service(
                user=new_user.id,
                specialty=Specialty.objects.first().id,
                time=time,
                date=date
            )

        # Match database with the same data (no saved appointment)
        self.assertEqual(1, Appointment.objects.count())

    @patch('medical_appointment.appointment.services.appointment_create')
    def test_appointment_not_working(self, appointment_create_mock):

        # Add day to date
        current_date = datetime.date.today()
        add_day = timedelta(days=1)
        date = current_date + add_day

        # Set hour not working-> range 8:00:00 - 16:00:00
        time = datetime.time(10, 30, 00)

        # Save a date not working
        appointment_assign_create(
            user=self.superuser.id,
            date=date,
            time=time
        )

        # Match appointment assing
        self.assertEqual(1, AppointmentAssign.objects.count())

        # create a appointment with the same date and time
        # Should raise ValidationError('The appointment its not day working')

        with self.assertRaises(ValidationError):
            self.service(
                user=self.user.id,
                specialty=Specialty.objects.first().id,
                date=date,
                time=time
            )

        # Match count Appointment
        self.assertEqual(0, Appointment.objects.count())
