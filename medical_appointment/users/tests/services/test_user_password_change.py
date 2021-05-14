from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.users.models import BaseUser
from medical_appointment.users.services import (user_change_password,
                                                user_create)


class UserPasswordChangeTest(TestCase):
    def setUp(self):
        self.password = fake.password()
        self.user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.email(),
            password=self.password
        )
        self.service = user_change_password

    @patch('medical_appointment.users.services.user_change_password')
    def test_user_invalid_old_password(self, user_change_password_mock):

        with self.assertRaises(ValidationError):
            old_password = fake.password()
            self.service(
                user_id=self.user.id,
                password=fake.password(),
                old_password=old_password
            )

    @patch('medical_appointment.users.services.user_change_password')
    def test_user_vulnerable_password(self, user_change_password_mock):
        with self.assertRaises(ValidationError):
            password_vulnerable = fake.password(length=5, digits=False)
            self.service(
                user_id=self.user.id,
                password=password_vulnerable,
                old_password=self.password
            )

    @patch('medical_appointment.users.services.user_password_change_email_send')
    def test_service_success_and_call_event(self, user_password_change_email_send_mock):
        self.service(
            user_id=self.user.id,
            password=fake.password(),
            old_password=self.password
        )

        user_password_change_email_send_mock.assert_called()
