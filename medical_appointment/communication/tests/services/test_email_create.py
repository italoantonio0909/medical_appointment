from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.communication.services import email_create


class EmailCreateTest(TestCase):
    def setUp(self):
        self.service = email_create

    @patch('medical_appointment.communication.services.email_create')
    def test_service_with_invalid_user(self, email_users_create_mock):
        with self.assertRaises(ValidationError):
            self.service(
                user_id=fake.random_digit(),
                subject=fake.bothify(text='Subject Number: ????-###'),
                body_text=fake.bothify(text='Body text: ????-###'),
                body_html=fake.bothify(text='Body html: ????-###')
            )
            