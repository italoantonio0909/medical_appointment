from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.communication.models import Email
from medical_appointment.communication.services import email_users_create
from medical_appointment.users.models import BaseUser
from medical_appointment.users.services import user_create


class EmailCreateTest(TestCase):
    def setUp(self):
        self.service = email_users_create

    @patch('medical_appointment.communication.services.email_users_create')
    def test_empty_list_users(self, email_users_create_mock):
        with self.assertRaises(ValidationError):
            self.service(
                users=[],
                subject=fake.bothify(text='Subject Number: ????-###'),
                body_text=fake.bothify(text='Body text ????-###'),
                body_html=fake.bothify(text='Body html ????-###'))

    @patch('medical_appointment.communication.services.email_users_create')
    def test_user_not_exists_in_list(self, email_users_create_mock):

        # List users id -> [1,4,2,9]
        users = [1, 2]
        with self.assertRaises(ValidationError):
            self.service(
                users=users,
                subject=fake.bothify(text='Subject Number: ????-###'),
                body_text=fake.bothify(text='Body text ????-###'),
                body_html=fake.bothify(text='Body html ????-###'))

    @patch('medical_appointment.communication.services.emails_send')
    def test_service_call_event_and_return_users_save(self, emails_send_mock):

        # Create users
        for x in range(5):
            user_create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                password=fake.password(),
                email=fake.email()
            )
            
        # Obtain user and collect ids
        users = [x.id for x in BaseUser.objects.filter(is_admin=False)]

        # Match users with range
        self.assertEqual(len(users), BaseUser.objects.count())

        self.service(
            users=users,
            subject=fake.bothify(text='Subject Number: ????-###'),
            body_text=fake.bothify(text='Body text ????-###'),
            body_html=fake.bothify(text='Body html ????-###')
        )

        emails_send_mock.assert_called()

        # Match Email objects with users
        self.assertNotEqual(0, Email.objects.count())