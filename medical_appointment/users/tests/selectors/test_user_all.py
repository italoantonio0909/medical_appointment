from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.users.models import BaseUser
from medical_appointment.users.selectors import user_all
from medical_appointment.users.services import user_create


class UserAllTest(TestCase):
    def setUp(self):
        self.selector = user_all

    @patch('medical_appointment.users.selectors.user_all')
    def test_selector_return_nothing(self, user_all_mock):
        result_selector = self.selector()

        # Tranform result <QuerySet [<BaseUser:[]> to list []
        result = list(result_selector)
        self.assertEqual(result, [])

    @patch('medical_appointment.users.selectors.user_all')
    def test_selector_return_user(self, user_all):

        # Create user
        user = user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            password=fake.password(),
            email=fake.email()
        )
        self.assertEqual(1, BaseUser.objects.count())

        result_selector = self.selector()

        result = list(result_selector)
        expect = [user]
        self.assertEqual(expect, result)
