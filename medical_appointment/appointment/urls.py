from django.urls import path, include

from .apis import (
    AppointmentCreateApi,
    AppointmentDeleteApi,
    AppointmentListApi,
    AppointmentAcceptApi,
    SpecialtyListApi,
    SpecialtyCreateApi,
    SpecialtyUpdateApi,
    AppointmentAssignCreateApi,
    AppointmentAssignListApi
)

appointment_patterns = [
    path('create/', AppointmentCreateApi.as_view()),
    path('list/', AppointmentListApi.as_view()),
    path('delete/<int:user_id>/<int:appointment_id>/', AppointmentDeleteApi.as_view()),
    path('accept/<int:user_id>/<int:appointment_id>/',AppointmentAcceptApi.as_view()),
]

specialties_patterns = [
    path('list/', SpecialtyListApi.as_view()),
    path('create/', SpecialtyCreateApi.as_view()),
    path('update/<int:specialty_id>/', SpecialtyUpdateApi.as_view()),
]

appointment_assign_urlpatterns = [
    path('create/', AppointmentAssignCreateApi.as_view()),
    path('list/', AppointmentAssignListApi.as_view()),
]

urlpatterns = [
    path('appointment/', include((appointment_patterns, 'appointment'))),
    path('specialties/', include((specialties_patterns, 'specialties'))),
    path('appointment_assign/',include((appointment_assign_urlpatterns,'appointment_assign')))
]
