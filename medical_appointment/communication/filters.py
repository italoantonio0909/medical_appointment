import django_filters

from .models import (
    Email
)


class EmailFilter(django_filters.FilterSet):
    class Meta:
        model = Email
        fields = (
            'user',
            'date_sent'
        )
