from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.communication.services import emails_send


class EmailsSendTest(TestCase):
    def setUp(self):
        self.service = emails_send
    
    @patch('medical_appointment.communication.services.emails_send')
    def test_service_with_empty_users_list(self,emails_send_mock):
        with self.assertRaises(ValidationError):
            self.service(
                subject=fake.bothify(text='Title Number: ????-###'),
                body_text=fake.bothify(text='Body str ????-###'),
                body_html=fake.bothify(text='Body html ????-###'),
                users=[]
            )