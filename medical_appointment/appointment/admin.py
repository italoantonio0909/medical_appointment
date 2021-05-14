from django.contrib import admin

from .models import (
    Specialty,
    Appointment,
    AppointmentAssign
)

admin.site.register(Specialty)
admin.site.register(Appointment)
admin.site.register(AppointmentAssign)
