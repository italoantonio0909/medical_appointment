from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.appointment.models import Appointment, Specialty
from medical_appointment.appointment.selectors import specialty_by_id
from medical_appointment.appointment.services import specialty_create
from medical_appointment.common.test_utils import fake


class SpecialtyByIdTest(TestCase):
    def setUp(self):
        self.selector = specialty_by_id

    @patch('medical_appointment.appointment.selectors.specialty_by_id')
    def test_selector_return_nothing(self, specialty_by_id_mock):
        with self.assertRaises(ValidationError):
            self.selector(id=fake.random_digit())

    @patch('medical_appointment.appointment.selectors.specialty_by_id')
    def test_selector_return_specialty(self, specialty_by_id_mock):

        # Create specialty
        specialty_create(title=fake.bothify(text='Specialty ????-###'))
        self.assertEqual(1, Specialty.objects.count())

        # Obtain specialty by id
        result = self.selector(id=Specialty.objects.first().id)
        self.assertNotEqual([], result)
