from django.core.exceptions import ValidationError

from .filters import EmailFilter
from .models import Email


def email_list(*, filters=None):
    filters = filters or {}

    qs = Email.objects.all()

    return EmailFilter(filters, qs).qs
