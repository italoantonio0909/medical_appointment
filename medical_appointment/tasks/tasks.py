from celery import shared_task

from medical_appointment.appointment.services import (
    appointment_remember
)


@shared_task
def task_appointment_remember():
    # Invoque service domain Appointment
    appointment_remember()
