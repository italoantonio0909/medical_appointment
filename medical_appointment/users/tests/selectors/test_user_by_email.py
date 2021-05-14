from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.users.models import BaseUser
from medical_appointment.users.selectors import user_by_email
from medical_appointment.users.services import user_create


class UserByEmailTest(TestCase):
    def setUp(self):
        self.selector = user_by_email

    @patch('medical_appointment.users.selectors.user_by_email')
    def test_selector_return_nothing(self, user_by_email_mock):
        with self.assertRaises(ValidationError):
            self.selector(email=fake.email())

    @patch('medical_appointment.users.selectors.user_by_email')
    def test_selector_return_user(self, user_by_email):

        user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )
        self.assertEqual(1, BaseUser.objects.count())

        result_selector = self.selector(email=user.email)

        # Transform data to array -> []
        self.assertEqual([result_selector], [user])
