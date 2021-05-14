from typing import Optional

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.exceptions import ValidationError
from django.utils.encoding import (DjangoUnicodeDecodeError, force_str,
                                   smart_bytes, smart_str)
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from medical_appointment.common.utils import update_fields

from .events import (user_create_email_send, user_password_change_email_send,
                     user_password_reset_check_email_send,
                     user_password_reset_email_send,
                     user_update_profile_email_send)
from .models import BaseUser
from .selectors import user_by_email, user_by_id, user_get
from .utils import user_check_valid, validate_password


def user_create(
    *,
    first_name: str,
    last_name: str,
    email: str = None,
    is_active: bool = True,
    is_admin: bool = False,
    password: Optional[str] = None
) -> BaseUser:

    user = BaseUser.objects.create_user(
        first_name=first_name.title(),
        last_name=last_name.title(),
        email=email,
        is_active=is_active,
        is_admin=is_admin,
        password=password,
    )

    # Send email create account
    user_create_email_send(user_id=user.id)

    return user


def user_create_superuser(
    *,
    first_name: str,
    last_name: str,
    email: str = None,
    password: Optional[str] = None
) -> BaseUser:

    user = BaseUser.objects.create_superuser(
        first_name=first_name.title(),
        last_name=last_name.title(),
        email=email,
        password=password,
    )

    # Send notification create account
    user_create_email_send(user_id=user.id)

    return user


def user_change_password(
    *,
    user_id: int,
    password: str,
    old_password: str
) -> BaseUser:

    user = user_by_id(id=user_id)

    # Check instance old password correct, raise ValidationError
    if not user.check_password(old_password):
        raise ValidationError('Contraseña anterior no válida.')

    # Check password with validations and set password.
    validate_password(password=password, username=user.email)
    user.set_password(password)
    user.save(update_fields=['password'])

    # Notify users change password success
    user_password_change_email_send(user_id=user.id)

    return user


def user_update_profile(
    *,
    user_session: int,
    user_id: int,
    data
) -> BaseUser:

    user_check_valid(user_session=user_session,user_id=user_id)

    valid_fields = [
        'first_name',
        'last_name',
        'email'
    ]

    # Obtain user
    user_change = user_by_id(id=user_id)

    fields, user = update_fields(
        fields=valid_fields,
        data=data,
        change=user_change
    )
    user.save(update_fields=fields)

    # Notify profile updated
    user_update_profile_email_send(user_id=user.id)

    return user


def user_password_reset(
    *,
    email: str
):

    user, token = user_make_token(email=email)

    # Send email with credentials token
    user_password_reset_email_send(user_id=user.id, token=token)

    return user, token


def user_password_reset_check(
    *,
    token: str,
    password: str
):

    try:
        # Extrack token user
        token_user = user_extract_token(token=token)

        # Extrack uidbd user id
        uidb64 = user_extract_uidb64(token=token)

        # Check if token is valid
        user= user_check_token(uidb64=uidb64, token=token_user)

        # Validate password strong and save a new password.
        validate_password(password=password, username=user.email)
        user.set_password(password)
        user.save(update_fields=['password'])

        # Notify success password reset
        user_password_reset_check_email_send(user_id=user.id)

        return user

    except DjangoUnicodeDecodeError as e:
        raise ValidationError('Código no válido.')


def user_extract_token(*, token: str):
    separator = '_'
    try:
        # remove blank token
        token_strip = token.strip()

        # Find separator
        extract_token = token_strip.find(separator)
        if not extract_token != -1:
            raise ValidationError('Código no válido.')

        return token[:extract_token]

    except Exception:
        raise ValidationError('Código no válido.')


def user_extract_uidb64(*, token: str):
    separator = '_'
    try:
        # remove blank token
        token_strip = token.strip()

        # Find separator
        extract_uidb64 = token_strip.find(separator)
        if not extract_uidb64 != -1:
            raise ValidationError('Código no válido.')

        return token[extract_uidb64 + 1:]

    except:
        raise ValidationError('Código no válido.')


def user_make_token(
    *,
    email: str
):
    user = user_by_email(email=email)

    separator = '_'
    uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
    token = PasswordResetTokenGenerator().make_token(user)
    token_formatter = f'{token}{separator}{uidb64}'

    return user, token_formatter


def user_check_token(*, uidb64: int, token: str) -> BaseUser:

    # Extract user detail with id user
    user_id = force_str(urlsafe_base64_decode(uidb64))

    # If not user exists, raise ValidationError
    user = user_by_id(id=user_id)

    # Token is relationship for user
    # Raise ValidationError
    if not PasswordResetTokenGenerator().check_token(user, token):
        raise ValidationError('Código no válido.')

    return user
