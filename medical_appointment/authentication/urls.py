from django.urls import include, path

from .apis import (UserLoginApi, UserLogoutApi, UserMeApi,
                   UserPasswordChangeApi, UserPasswordResetApi,
                   UserPasswordResetCheckApi, UserRegisterApi,
                   UserUpdateProfileApi)

user_patterns = [
    path('login/', UserLoginApi.as_view(), name='login'),
    path('logout/', UserLogoutApi.as_view(), name='logout'),
    path('register/', UserRegisterApi.as_view(), name='register'),
    path('me/', UserMeApi.as_view(), name='me'),
    path('change_password/<int:user_id>/',
         UserPasswordChangeApi.as_view(), name='change_password'),
    path('update_profile/<int:user_id>/',
         UserUpdateProfileApi.as_view(), name='update_profile'),
    path('reset_password/', UserPasswordResetApi.as_view(), name='reset_password'),
    path('reset_password_check/<str:token>/',
         UserPasswordResetCheckApi.as_view(), name='reset_password_check'),
]

urlpatterns = [
    path('auth/', include((user_patterns, 'auth'))),
]
