from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.users.models import BaseUser
from medical_appointment.users.services import (user_create,
                                                user_password_reset,
                                                user_password_reset_check)


class UserPasswordResetCheckTest(TestCase):
    def setUp(self):
        self.service = user_password_reset_check

    @patch('medical_appointment.users.services.user_password_reset_check')
    def test_token_invalid(self, user_password_reset_check_mock):
        password = fake.password()
        user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=password,
            email=fake.email())

        # Obtain token and user
        user_password_reset(email=user.email)

        # Code no valid in check
        token = fake.sha1()
        with self.assertRaises(ValidationError):
            self.service(token=token, password=password)

    @patch('medical_appointment.users.services.user_password_reset_check')
    def test_token_is_none(self, user_password_reset_check_mock):
        password = fake.password()
        user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=password,
            email=fake.email()
        )

        # Obtain token and user
        user_password_reset(email=user.email)

        # Code no valid in check
        with self.assertRaises(ValidationError):
            self.service(token=None, password=password)

    @patch('medical_appointment.users.services.user_password_reset_check')
    def test_token_valid_with_vulnerable_password(self, user_password_reset_check_mock):
        user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )
        # Obtain token and user
        _, token = user_password_reset(email=user.email)

        # Token valid with invalid password
        password_vulnerable = fake.password(length=5, digits=False)
        with self.assertRaises(ValidationError):
            self.service(token=token, password=password_vulnerable)

    @patch('medical_appointment.users.services.user_password_reset_check_email_send')
    def test_valid_token_password_and_call_service(self, user_password_reset_check_email_send_mock):
        user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )
        # Obtain token and user
        _, token = user_password_reset(email=user.email)

        # Token valid with invalid password
        password_vulnerable = fake.password(length=5, digits=False)
        self.service(token=token, password=fake.password())

        user_password_reset_check_email_send_mock.assert_called()
