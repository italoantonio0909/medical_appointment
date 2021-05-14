from unittest.mock import patch

from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.communication.models import Email
from medical_appointment.communication.services import emails_create
from medical_appointment.users.models import BaseUser
from medical_appointment.users.services import user_create


class EmailsCreateTest(TestCase):
    def setUp(self):
        self.service = emails_create

    @patch('medical_appointment.communication.services.emails_create')
    def test_service_return_users(self, email_users_create_mock):
        for x in range(4):
            user_create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                password=fake.password()
            )

        self.assertNotEqual(0, BaseUser.objects.count())
        users = BaseUser.objects.filter(is_admin=False).filter(is_active=True)
        users_list= [x.id for x in users]

        self.service(
            subject=fake.bothify(text='Title Number: ????-###'),
            body_text=fake.bothify(text='Body str ????-###'),
            body_html=fake.bothify(text='Body html ????-###'),
            users=users_list
        )
        self.assertNotEqual(0, Email.objects.count())
            
            