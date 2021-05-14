from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase, override_settings
from medical_appointment.common.test_utils import fake
from medical_appointment.users.models import BaseUser
from medical_appointment.users.services import user_create


class UserCreateTest(TestCase):
    def setUp(self):
        self.service = user_create

    @patch('medical_appointment.users.services.user_create')
    def test_user_with_unusable_password(self, user_create_mock):
        user = self.service(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=None,
            email=fake.email()
        )

        self.assertFalse(user.has_usable_password())

    @patch('medical_appointment.users.services.user_create')
    def test_user_with_vulnerable_password(self, user_create_mock):
        """Validate password with common cases:
           UserAttributeSimilarityValidator
           MinimumLengthValidator
           CommonPasswordValidator
           NumericPasswordValidator

        """
        vulnerable_password = fake.password(length=5, digits=False)
        with self.assertRaises(ValidationError):
            user = self.service(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                password=vulnerable_password,
                email=fake.email()
            )

    @patch('medical_appointment.users.services.user_create')
    def test_user_with_capitalize_email_cannot_created(self, user_create_mock):
        email = fake.email()
        email_upper = email.upper()
        self.service(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=email
        )

        with self.assertRaises(ValidationError):
            self.service(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                password=fake.password(),
                email=email_upper
            )

        self.assertEqual(1, BaseUser.objects.count())

    @patch('medical_appointment.users.services.user_create_email_send')
    def test_user_create_and_call_event(self, user_create_email_send_mock):
        user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=None,
            email=fake.email()
        )
        user_create_email_send_mock.assert_called()
