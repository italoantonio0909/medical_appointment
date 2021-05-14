from unittest.mock import patch

from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.communication.models import Email
from medical_appointment.communication.services import email_send
from medical_appointment.users.services import user_create


class EmailSendTest(TestCase):
    def setUp(self):
        self.user=user_create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.email(),
            password=fake.password()
        )
        self.service = email_send
    
    @patch('medical_appointment.communication.services.email_send_message')
    def test_call_event(self,email_send_message_mock):
        self.service(
            subject=fake.bothify(text='Title Number: ????-###'),
            body_text=fake.bothify(text='Body str ????-###'),
            body_html=fake.bothify(text='Body html ????-###'),
            user_id=self.user.id
        )
        email_send_message_mock.assert_called()
    
    @patch('medical_appointment.communication.services.email_send')
    def test_save_database_sent_email(self,email_send_mock):
        self.service(
            subject=fake.bothify(text='Title Number: ????-###'),
            body_text=fake.bothify(text='Body str ????-###'),
            body_html=fake.bothify(text='Body html ????-###'),
            user_id=self.user.id
        )

        # Emails sent, create account and send email utility
        self.assertEqual(2, Email.objects.count())