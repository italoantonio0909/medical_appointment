from unittest.mock import patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from medical_appointment.appointment.models import Specialty
from medical_appointment.appointment.services import specialty_create
from medical_appointment.common.test_utils import fake


class SpecialtyCreateTest(TestCase):
    def setUp(self):
        self.service = specialty_create

    @patch('medical_appointment.appointment.services.specialty_create')
    def test_specialty_not_create_capitalize_title(self, specialty_create_mock):

        # Create a specialty
        title = fake.bothify(text='Specialty ????-###')
        title_upper = title.upper()
        self.service(title=title)

        with self.assertRaises(ValidationError):
            # Specialty with a exists title capitalize
            self.service(title=title_upper)

        self.assertEqual(1, Specialty.objects.count())
