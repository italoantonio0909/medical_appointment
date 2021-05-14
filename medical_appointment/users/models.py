from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .managers import BaseUserManager


class BaseUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to='avatar', blank=True)

    created_on = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    # Manager user
    objects = BaseUserManager()

    # Username to validate session, this field is unique.
    USERNAME_FIELD = 'email'

    # Fields email and password are required by default, when
    # create a superuser.
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
        
    def is_staff(self):
        return self.is_admin

    def __str__(self):
        return self.email
    
