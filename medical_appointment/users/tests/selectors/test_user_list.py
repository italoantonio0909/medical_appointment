from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.common.test_utils import fake
from medical_appointment.users.models import BaseUser
from medical_appointment.users.selectors import user_list
from medical_appointment.users.services import user_create
from collections import OrderedDict


class UserListTest(TestCase):
    def setUp(self):
        self.selector = user_list
    
    @patch('medical_appointment.users.selectors.user_list')
    def test_selector_return_nothing(self, user_list_mock):
        result = self.selector(filters = {})
        self.assertEqual([], list(result))
        

    @patch('medical_appointment.users.selectors.user_list')
    def test_selector_return_users_list(self, user_list_mock):
        for x in range(5):
            user_create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                password=fake.password()
            )

        # Prepare filter
        # Fields avaibles
        # first_name, last_name, email, is_active
        filters = OrderedDict()
        filters['is_active']= True

        result = self.selector(filters=filters)
        self.assertNotEqual([], list(result))


   
