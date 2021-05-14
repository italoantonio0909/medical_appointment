from datetime import date

from django.db import models
from medical_appointment.users.models import BaseUser


class Specialty(models.Model):
    title = models.CharField(max_length=50, unique=True)

    created_on = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Appointment(models.Model):
    specialty = models.ForeignKey(Specialty, on_delete=models.PROTECT)
    date = models.DateField(auto_now_add=False)
    time = models.TimeField(auto_now_add=False)
    rejected = models.BooleanField(default=False)
    user = models.ForeignKey(BaseUser, on_delete=models.PROTECT)

    created_on = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['time']


    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    @property
    def days_for_appointment(self):
        current_day = date.today()
        difference_days = self.date - current_day
        return difference_days.days

    def __str__(self):
        return f'{self.user.email} -- {self.specialty.title} {self.date} {self.time}'


class AppointmentAssign(models.Model):
    user = models.ForeignKey(BaseUser, on_delete=models.PROTECT)
    date = models.DateField(auto_now_add=False)
    time = models.TimeField(auto_now_add=False)
    created_on = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.date} {self.time}'
