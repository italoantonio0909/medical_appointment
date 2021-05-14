from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.appointment.models import Specialty
from medical_appointment.appointment.services import specialty_update, specialty_create
from medical_appointment.common.test_utils import fake
from collections import OrderedDict


class SpecialtyCreateTest(TestCase):
    def setUp(self):
        self.service = specialty_update

    @patch('medical_appointment.appointment.services.specialty_update')
    def test_specialty_no_souch_found(self, specialty_update_mock):
        with self.assertRaises(ValidationError):
            self.service(specialty_id=fake.random_digit(),data={})
    
    @patch('medical_appointment.appointment.services.specialty_update')
    def test_specialty_update(self, specialty_update_mock):
        specialty_create(title= fake.bothify(text='Specialty ????-###'))
        
        data = OrderedDict({ 'is_active': False })
        self.service(
            specialty_id=Specialty.objects.first().id,
            data=data
        )

        self.assertFalse(Specialty.objects.first().is_active)

    @patch('medical_appointment.appointment.services.specialty_update')
    def test_service_invalid_data(self, specialty_update_mock):
        specialty_create(title= fake.bothify(text='Specialty ????-###'))
        with self.assertRaises(ValidationError):
            self.service(specialty_id=Specialty.objects.first().id, data={})
