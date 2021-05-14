from django.core.exceptions import ValidationError

from .models import BaseUser
from .filters import BaseUserFilter
from .utils import user_avatar_default


def user_get(*, user: BaseUser):

    return {
        'id': user.id,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'avatar': user.avatar.url if user.avatar else user_avatar_default(),
        'last_login': user.last_login,
        'is_active': user.is_active,
        'is_admin': user.is_admin,
        'is_superuser': user.is_superuser,
    }


def user_by_id(*, id: int) -> BaseUser:
    try:

        return BaseUser.objects.get(id=id)

    except BaseUser.DoesNotExist:
        raise ValidationError('This user no souch found.')


def user_list(*, filters=None):
    filters = filters or {}

    qs = BaseUser.objects.all()

    return BaseUserFilter(filters, qs).qs


def user_all():
    return BaseUser.objects.filter(is_active=True)


def user_by_email(*, email: str):
    try:

        return BaseUser.objects.get(email=email)

    except:
        raise ValidationError('This user no souch found.')
