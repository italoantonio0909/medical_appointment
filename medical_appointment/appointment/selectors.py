from typing import Iterable

from django.core.exceptions import ValidationError

from .filters import (AppointmentAssignFilter, AppointmentFilter,
                      SpecialtyFilter)
from .models import Appointment, AppointmentAssign, Specialty


def specialty_list(*, filters=None) -> Iterable[Specialty]:
    filters = filters or {}

    qs = Specialty.objects.all()

    return SpecialtyFilter(filters, qs).qs


def specialty_by_id(*, id: int) -> Specialty:
    try:

        return Specialty.objects.get(id=id)

    except Specialty.DoesNotExist:
        raise ValidationError('Specialty no souch found')


def specialty_get_data(*, id:int) -> Specialty:
    specialty = specialty_by_id(id=id)

    return {
        'id':specialty.id,
        'title':specialty.title,
        'state':specialty.is_active
    }


def appointment_filter_date_time(*, date, time) -> Iterable[Appointment]:
    return Appointment.objects.filter(date=date).filter(time=time)


def appointment_filter_date(*, date) -> Iterable[Appointment]:
    return Appointment.objects.filter(date=date).filter(rejected=False)


def appointment_by_id(*, id: int) -> Appointment:
    try:

        return Appointment.objects.get(id=id)

    except Appointment.DoesNotExist:
        raise ValidationError('This appointment not souch found')


def appointment_list(*, filters=None):
    filters = filters or {}

    qs = Appointment.objects.all()

    return AppointmentFilter(filters, qs).qs


def appointment_assign_list(*, filters=None):
    filters = filters or {}

    qs = AppointmentAssign.objects.all()

    return AppointmentAssignFilter(filters, qs).qs


def appointment_assign_by_id(*, id: int) -> AppointmentAssign:
    try:

        return AppointmentAssign.objects.get(id=id)

    except AppointmentAssign.DoesNotExist:
        raise ValidationError('This appointment assign no souch found')


def appointment_assign_filter_date(*, date) -> Iterable[AppointmentAssign]:
    return AppointmentAssign.objects.filter(date=date)


def appointment_get_data(*,id:int) -> Appointment:
    appointment = appointment_by_id(id=id)

    return {
        'id': appointment.id,
        'date': appointment.date,
        'time': appointment.time,
        'specialty': {
            'id': appointment.specialty.id,
            'title': appointment.specialty.title
        },
        'days_for_appointment': appointment.days_for_appointment
    }


def appointment_assign_get_data(*,id:int) -> AppointmentAssign:
    appointment = appointment_assign_by_id(id=id)

    return {
        'id': appointment.id,
        'date': appointment.date,
        'time': appointment.time,
    }
