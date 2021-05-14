from django.urls import path, include

from .apis import (
    EmailListApi,
    EmailCreateApi
)

emails_urlpatterns = [
    path('create/', EmailCreateApi.as_view()),
    path('list/', EmailListApi.as_view()),
]

urlpatterns = [
    path('emails/', include((emails_urlpatterns))),
]
