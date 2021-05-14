from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static, settings

urlpatterns = [
    path('', include('medical_appointment.users.urls')),
    path('', include('medical_appointment.appointment.urls')),
    path('', include('medical_appointment.authentication.urls')),
    path('', include('medical_appointment.communication.urls')),
]

"""This metod settings for static files
"""
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
