from django.core.exceptions import ValidationError
from medical_appointment.api.mixins import ApiAuthMixin, ApiErrorsMixin
from medical_appointment.common.utils import inline_serializer
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .selectors import email_list
from .services import email_users_create


class EmailListApi(ApiErrorsMixin, APIView):
    """Class that allows to list objects of Email

    """
    class FilterSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=False)
        user = serializers.IntegerField(required=False)
        date_sent = serializers.DateField(required=False)
        is_active = serializers.BooleanField(required=False, default=True)

    class InputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        subject=serializers.CharField()
        body_text = serializers.CharField()
        date_sent = serializers.DateField()
        # Inline serializer user
        user = inline_serializer(fields={
            'id': serializers.IntegerField(),
            'email': serializers.EmailField(),
        })

    def get(self, request):

        # Validate filter serializer
        filters_serializer = self.FilterSerializer(data=request.query_params)
        filters_serializer.is_valid(raise_exception=True)

        # Get emails and dispatch
        emails = email_list(filters=filters_serializer.validated_data)

        # Response data to json
        data = self.InputSerializer(emails, many=True).data

        return Response(data)


class EmailCreateApi(ApiErrorsMixin, APIView):
    """Class that allows create objects of Email and send mails to users array


    Parameters:
    user -- Arrays users id
    body -- Content to send email
    state -- boolean state
    """

    class InputSerializer(serializers.Serializer):
        # Users id
        users = serializers.ListField(child=serializers.IntegerField())
        subject= serializers.CharField()
        body_text = serializers.CharField()
        body_html = serializers.CharField(required=False,default=None)

    def post(self, request):

        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create objects emails and save
        email_users_create(**serializer.validated_data)

        return Response(status=status.HTTP_201_CREATED)
