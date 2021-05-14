from django.contrib import sessions
from django.contrib.auth import authenticate, login, logout
from medical_appointment.api.mixins import ApiAuthMixin, ApiErrorsMixin
from medical_appointment.users.models import BaseUser
from medical_appointment.users.selectors import user_get
from medical_appointment.users.services import (user_change_password,
                                                user_create,
                                                user_password_reset,
                                                user_password_reset_check,
                                                user_update_profile)
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView


class UserLoginApi(APIView):
    class InputSerializer(serializers.Serializer):
        email = serializers.EmailField()
        password = serializers.CharField()
    
    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(request, **serializer.validated_data)
        
        if user is None:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    
        login(request, user)
    
        data = user_get(user=user)
        session_key = request.session.session_key

        return Response({
            'session': session_key,
            'data':data
        })



class UserLogoutApi(APIView):        
    def post(self, request):
        logout(request)
        
        return Response()



class UserRegisterApi(ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        first_name = serializers.CharField()
        last_name = serializers.CharField()
        email = serializers.EmailField()
        password = serializers.CharField()
    
    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_create(**serializer.validated_data)
        
        return Response(status=status.HTTP_201_CREATED)



class UserMeApi(ApiAuthMixin, APIView):
    def get(self, request):
        
        data = user_get(user=request.user)

        return Response(data)



class UserPasswordChangeApi(ApiAuthMixin, ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        old_password = serializers.CharField()
        password = serializers.CharField()
    
    def post(self, request,user_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
    
        user_change_password(user_id=user_id,**serializer.validated_data)

        return Response(status=status.HTTP_201_CREATED)



class UserUpdateProfileApi(ApiAuthMixin, ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        first_name = serializers.CharField()
        last_name=serializers.CharField()
        email = serializers.EmailField()
    
    def post(self, request, user_id):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = user_update_profile(
            user_session=request.user.id,
            user_id=user_id,
            data=serializer.validated_data
        )
        user_data = user_get(user=user) 

        return Response({'data' : user_data}, status=status.HTTP_201_CREATED)
        


class UserPasswordResetApi(ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        email = serializers.EmailField()
    
    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_password_reset(**serializer.validated_data)

        return Response(status=status.HTTP_201_CREATED)



class UserPasswordResetCheckApi(ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        password = serializers.CharField()
    
    def post(self, request,token):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_password_reset_check(token=token, **serializer.validated_data)

        return Response(status=status.HTTP_201_CREATED)

