import django.contrib.auth.password_validation as validators
from django.core.exceptions import ValidationError
import os
from django.conf import settings


def validate_password(*, password: str, username:str):

    errors = dict()

    try:
        # Validate the password and username and catch the exception
        validators.validate_password(password=password, user=username)
        
    except Exception as error:
        errors['password'] = list(error.messages)
    
    if errors:
        raise ValidationError(errors)
    

def user_check_valid(*, user_session: int, user_id: int):
    # Validate if the user sent as a parameter has a
    # relationship with the user in session extracted from the token
    if user_session != user_id:
        raise ValidationError('You dont have permissions for this user.')


def user_avatar_default():
    """This method allows to establish a 
       default avatar for the user, search the
       directory and find the default image
    """

    default_name_directory = 'default'
    media_url = settings.MEDIA_URL
    media_url_formated = media_url.replace('/', '')
    media_avatar_default = f'{media_url_formated}/{default_name_directory}'

    base_dir = os.getcwd()
    default_directory = os.path.join(base_dir, media_avatar_default)

    if not os.path.exists(default_directory):
        return None

    avatar_name = os.listdir(default_directory)[0]
    avatar_default = f'/{media_avatar_default}/{avatar_name}'
    
    return  avatar_default
