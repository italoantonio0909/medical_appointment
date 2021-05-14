import datetime
from datetime import timedelta

from django.core.exceptions import ValidationError
from medical_appointment.common.utils import update_fields

from .events import (appointment_accept_email_send,
                     appointment_assign_create_email_send,
                     appointment_create_email_send,
                     appointment_delete_email_send,
                     appointment_remember_email_send)
from .models import Appointment, AppointmentAssign, Specialty
from .selectors import (
                        appointment_assign_filter_date,
                        appointment_assign_get_data,
                        appointment_by_id, appointment_filter_date,
                        appointment_filter_date_time, appointment_get_data,
                        specialty_by_id,
                        specialty_get_data)


def specialty_create(*, title: str) -> Specialty:
    """Create a specialty appointment


    Parameters:
    title -- Title specialty
    """
    # Saving object
    specialty = Specialty(title=title.title())
    specialty.save()

    # Get object and dispatch
    specialty_data = specialty_get_data(id=specialty.id)

    return specialty_data


def specialty_update(*, specialty_id:int, data) -> Specialty:
    
    specialty_change = specialty_by_id(id=specialty_id)
    valid_fields = ['title','is_active']

    fields,specialty = update_fields(
        fields=valid_fields,
        data=data,
        change=specialty_change
    )

    specialty.save(update_fields=fields)

    return specialty
    

def appointment_create(*, specialty: int, user: int, date, time) -> Appointment:
    """Create a medical appointment


    Parameters:
    specialty -- Specialty id of appointment
    user -- User id of session
    date -- Date selected
    time -- Time selected    
    """

    # Check avaible time and date
    check_avaible_time_date(date=date, time=time)

    # Check avaible appointment
    check_avaible(date=date, time=time)

    # Saving object
    appointment = Appointment(
        specialty_id=specialty,
        user_id=user,
        date=date,
        time=time
    )
    appointment.save()

    # Sending email
    appointment_create_email_send(user_id=user, appointment_id=appointment.id)

    appointment_data = appointment_get_data(id=appointment.id) 

    return appointment_data


def appointment_delete(*, user_id: int, appointment_id: int) -> Appointment:
    """Delete an appointment


    Parameters
    appointment_id -- Identification id appointment
    user_id -- User in session
    """
    # Appointment get
    appointment = appointment_by_id(id=appointment_id)

    # Validate rejected
    if appointment.rejected:
        raise ValidationError('Esta cita ya fue eliminada.')

    # Update rejected to True
    appointment.rejected = True
    appointment.save(update_fields=['rejected'])

    # Notify users when appointment deleted
    appointment_delete_email_send(appointment_id=appointment.id, user_id=user_id)
    
    appointment_data = appointment_get_data(id=appointment.id)

    return appointment_data


def appointment_remember():
    """This method allows you to remember the day of the appointment
    It allows to notify a user when their appointment is at 24 hours.


    """
    # Current day
    current_day = datetime.date.today()

    # Later day
    date = current_day + timedelta(days=1)

    # Filter appointment if exists
    appointments = appointment_filter_date(date=date)
    if appointments.exists():
        for x in appointments:
            # Notify users remember appointment
            appointment_remember_email_send(appointment_id=x.id, user_id=x.user.id)

    return appointments


def appointment_accept(*, user_id: int, appointment_id: int):
    """Allows you to reuse a declined appointment


    Parameters:
    appointment_id -- Appointment id
    """
    # Appointment get, if not souch raise ValidationError
    appointment = appointment_by_id(id=appointment_id)

    if appointment.rejected == False:
        raise ValidationError(
            'Esta cita médica ya fue utilizada por otro usuario.')

    # Save object
    appointment.rejected = False
    appointment.user_id = user_id
    appointment.save(update_fields=['user', 'rejected'])

    # Notify when a user reuse an appointment
    appointment_accept_email_send(appointment_id=appointment_id, user_id=user_id)

    appointment_data = appointment_get_data(id=appointment_id)

    return appointment_data


def appointment_assign_create(*, user: int, date, time) -> AppointmentAssign:
    """Create a medical appointment


    Parameters:
    date -- Date selected
    time -- Time selected    
    """

    # Check avaible time and date
    check_avaible_time_date(date=date, time=time)

    if appointment_assign_filter_date(date=date).exists():
        raise ValidationError('Ésta fecha ya fue asignada como no laborable.')

    # Saving object
    appointment = AppointmentAssign(
        user_id=user,
        date=date,
        time=time
    )
    appointment.save()

    # Notify users
    appointment_assign_create_email_send(appointment_assign_id=appointment.id)

    appointment_data = appointment_assign_get_data(id=appointment.id)

    return appointment_data


def check_avaible_time_date(*, date, time):

    current_month = datetime.date.today().month
    current_year = datetime.date.today().year
    current_day = datetime.date.today().day

    if time.hour >= 17 or time.hour < 8:
        raise ValidationError('Horario no disponible.')

    if date.month < current_month:
        raise ValidationError('El mes no es actual.')

    if date.year < current_year or date.year > current_year:
        raise ValidationError('El año {} no es válido.'.format(date.year))

    if current_month == date.month:
        if date.day <= current_day:
            raise ValidationError(
                'El día {} de éste mes no es correcto.'.format(date.day))

    if time.minute != 30 and time.minute != 00:
        raise ValidationError('Seleccione un rango de 30 minutos.')


def check_avaible(*, date, time):

    if appointment_filter_date_time(date=date, time=time).exists():
        raise ValidationError(
            'Ya existe una cita médica para esta fecha y hora en específico.')

    appointment_not_avaible = appointment_assign_filter_date(date=date)
    if appointment_not_avaible.exists():
        if time.hour >= appointment_not_avaible[0].time.hour:
            raise ValidationError(
                'Este fecha con la hora seleccionada fueron inhabilitadas por el administrador.')
