from medical_appointment.api.mixins import ApiAuthMixin, ApiErrorsMixin
from medical_appointment.common.utils import inline_serializer
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Appointment, Specialty
from .selectors import (appointment_assign_list, appointment_list, specialty_list)
from .services import (appointment_accept, appointment_assign_create,appointment_create,
                       appointment_delete, specialty_create,
                       specialty_update)


class SpecialtyListApi(ApiErrorsMixin, APIView):
    """Class that allows to list objects of Specialty

    """
    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        title = serializers.CharField(required=False)
        is_active = serializers.BooleanField(required=False, default=True)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Specialty
            fields = (
                'id',
                'title',
                'is_active'
            )

    def get(self, request):

        # Filter querysets and validate

        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        print(filters_serializer.validated_data)

        specialties = specialty_list(filters=filters_serializer.validated_data)

        data = self.OutputSerializer(specialties, many=True).data

        return Response(data)


class SpecialtyCreateApi(ApiErrorsMixin, APIView):
    """Class that allows create objects of Specialty

    Parameters:
    title -- Title of object
    state -- boolean state
    """
    class InputSerializer(serializers.Serializer):
        title = serializers.CharField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        specialty = specialty_create(**serializer.validated_data)

        return Response(specialty, status=status.HTTP_201_CREATED)


class SpecialtyUpdateApi(ApiErrorsMixin, APIView):
    """Class that allows create objects of Specialty

    Parameters:
    title -- Title of object
    state -- boolean state
    """
    class InputSerializer(serializers.Serializer):
        title = serializers.CharField(required=False)
        is_active=serializers.BooleanField(required=False)

    def post(self, request, specialty_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        specialty = specialty_update(specialty_id=specialty_id,data=serializer.validated_data)

        return Response(status=status.HTTP_201_CREATED)


class AppointmentCreateApi(ApiErrorsMixin, APIView):
    """This class allows you to create an appointment


    Parameters:
    specialty -- Id specialty
    date -- Date selected
    time -- Time selected
    user -- User in session
    """
    class InputSerializer(serializers.Serializer):
        user = serializers.IntegerField()
        specialty = serializers.IntegerField()
        date = serializers.DateField()
        time = serializers.TimeField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        appointment = appointment_create(**serializer.validated_data)

        return Response(appointment, status=status.HTTP_201_CREATED)


class AppointmentDeleteApi(ApiErrorsMixin, APIView):
    """This class allows you to delete an appointment, 
       its rejection property becomes true.

       Parameters:
       appointment_id --  Identification appointment

    """

    def post(self, request, user_id, appointment_id):

        appointment = appointment_delete(
            user_id=user_id, appointment_id=appointment_id)

        return Response(appointment, status=status.HTTP_201_CREATED)


class AppointmentListApi(ApiErrorsMixin, APIView):
    """This class allows you to list the selected appointments

    """
    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        specialty = serializers.IntegerField(required=False)
        date = serializers.DateField(required=False)
        time = serializers.TimeField(required=False)
        user = serializers.IntegerField(required=False)
        rejected = serializers.BooleanField(required=False)

    class InputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        time = serializers.TimeField()
        date = serializers.DateField()
        days_for_appointment = serializers.IntegerField()
        rejected = serializers.BooleanField()
        # Inline serializer User
        user = inline_serializer(fields={
            'id': serializers.IntegerField(),
            'email': serializers.CharField(),
            'avatar':serializers.ImageField()
        })
        # Inline serializer specialty
        specialty = inline_serializer(fields={
            'id': serializers.IntegerField(),
            'title': serializers.CharField(),
        })

    def get(self, request):

        # Filter querysets and validate
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        # Get appointments
        appointments = appointment_list(
            filters=filters_serializer.validated_data)

        # Dispatch format json
        data = self.InputSerializer(appointments, many=True).data

        return Response(data)


class AppointmentAcceptApi(ApiErrorsMixin, APIView):
    """Allows you to reuse a declined appointment


    Parameters:
    appointment_id -- Appointment id
    user_id -- User id session
    """

    def post(self, request, user_id, appointment_id):
        appointment = appointment_accept(
            user_id=user_id, appointment_id=appointment_id)

        return Response(appointment, status=status.HTTP_201_CREATED)


class AppointmentAssignListApi(ApiErrorsMixin, APIView):
    """Class that allow list non-working days appointment


    """
    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        date = serializers.DateField(required=False)
        time = serializers.TimeField(required=False)
        is_active = serializers.BooleanField(required=False, default=True)
        created_on = serializers.DateField(required=False)

    class InputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        time = serializers.TimeField()
        date = serializers.DateField()
        is_active = serializers.BooleanField()
        # Inline serializer user
        user = inline_serializer(fields={
            'id': serializers.IntegerField(),
            'email': serializers.EmailField()
        })

    def get(self, request):

        # Filter querysets and validate
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        # Appointment assing list
        appointment_assign = appointment_assign_list(
            filters=filters_serializer.validated_data)

        # Response Json data
        data = self.InputSerializer(appointment_assign, many=True).data

        return Response(data)


class AppointmentAssignCreateApi(ApiAuthMixin, ApiErrorsMixin, APIView):
    """Class that allows creating non-working days objects
    """
    class InputSerializer(serializers.Serializer):
        user = serializers.IntegerField(default=1)
        time = serializers.TimeField()
        date = serializers.DateField()

    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        appointment_assign = appointment_assign_create(
            **serializer.validated_data)

        return Response(appointment_assign, status=status.HTTP_201_CREATED)
