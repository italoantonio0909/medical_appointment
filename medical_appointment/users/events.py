from .models import BaseUser
from .selectors import(
    user_by_id,
)

from medical_appointment.communication.services import (
    email_send
)


def user_create_email_send(*, user_id: int) -> BaseUser:
    # Obtain user
    user = user_by_id(id=user_id)
    
    subject = 'Creación de cuenta.'
    body_text = f'{user.first_name} {user.last_name} '\
              'Gracias por formar parte de nosotros.'\
              '\nPor este medio estaremos en constante aviso '\
              'sobre eventos o sucesos del consultorio.'
              
    email_send(subject=subject, body_text=body_text, user_id=user_id,body_html=None)

    return user



def user_password_reset_email_send(
    *,
    user_id: int,
    token:str
    ):

    # Obtain user
    user = user_by_id(id=user_id)

    subject = 'Reestablecimiento de contraseña.'
    body_text = f'{user.first_name} {user.last_name} '\
              f'\n Copia el siguiente código para poder reestablecer tu contraseña \n {token}'

    email_send(subject=subject, body_text=body_text, user_id=user_id, body_html=None)

    return user



def user_password_change_email_send(
    *,
    user_id: int
    ) -> BaseUser:
    
    # Obtain user
    user = user_by_id(id=user_id)
    
    subject = 'Reestablecimiento de contraseña.'
    body_text = f'{user.first_name} {user.last_name}'\
              'Tu contraseña ha sido reestablecida con éxito.'

    email_send(subject=subject, body_text=body_text, user_id=user_id, body_html=None)
    
    return user



def user_update_profile_email_send(
    *,
    user_id:int
    ) -> BaseUser:

    # Obtain user
    user = user_by_id(id=user_id)
    
    subject = 'Actualización de perfil.'
    body_text = f'{user.first_name} {user.last_name} \n'\
              'Tu perfil ha sido actualizado con éxito.'

    email_send(subject=subject, body_text=body_text, user_id=user_id, body_html=None)
    
    return user



def user_password_reset_check_email_send(
    *,
    user_id: int
    ) -> BaseUser:
    
    user = user_by_id(id=user_id)
    
    subject = 'Reestablecimiento de contraseña'
    body_text = f'Hola {user.first_name} {user.last_name} tu contraseña '\
              'ha sido correctamente establecida.'

    email_send(subject=subject, body_text=body_text, user_id=user_id, body_html=None)

    return user
    