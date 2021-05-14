import django_filters

from .models import (
    Appointment,
    Specialty,
    AppointmentAssign
)


class AppointmentFilter(django_filters.FilterSet):
    class Meta:
        model = Appointment
        fields = (
            'id',
            'date',
            'user',
            'time',
            'specialty',
            'rejected'
        )


class SpecialtyFilter(django_filters.FilterSet):
    class Meta:
        model = Specialty
        fields = (
            'id',
            'title',
            'is_active'
        )


class AppointmentAssignFilter(django_filters.FilterSet):
    class Meta:
        model = AppointmentAssign
        fields = (
            'id',
            'date',
            'time',
            'created_on',
            'is_active'
        )
