from medical_appointment.communication.services import email_send, emails_send
from medical_appointment.users.selectors import user_all, user_by_id

from .selectors import appointment_assign_by_id, appointment_by_id


def appointment_create_email_send(
    *,
    user_id: int,
    appointment_id: int
    ):
    """Allows to notify to user


    Parameters:
    user_id -- User id Appointment
    appointment_id -- Appointment id
    """

    user = user_by_id(id = user_id)
    appointment = appointment_by_id(id = appointment_id)

    subject = 'Asignación de cita médica.'
    body_text = f'{user.first_name} {user.last_name}'\
              f'\nSu cita médica con fecha {appointment.date} y hora '\
              f'{appointment.time} ha sido asignada con éxito.'

    email_send(subject = subject, body_text = body_text, user_id=user_id, body_html=None)

    return user



def appointment_delete_email_send(*, user_id: int, appointment_id: int):
    """Allows to notify users by email excluding the administrator and object creator


    Parameters:
    appointment -- Object Appointment
    """
    
    # Appointment get
    appointment = appointment_by_id(id = appointment_id)
    
    # Users list
    users = [x.id for x in user_all()]

    subject = 'Eliminación de cita médica'
    body_text = f'La cita médica con fecha {appointment.date} '\
              f'y hora {appointment.time} ha sido rechazada. '\
              f'¿Desea tomar este turno? \n'\
              f'Para hacer uso de esta cita consulte en nuestra aplicación móvil.'

    emails_send(subject=subject, body_text=body_text, users=users, body_html=None)

    return users



def appointment_remember_email_send(
    *,
    appointment_id,
    user_id: int
    ):
    """Allows to notify a user when an appointment is one day away


    Parameters:
    appointment -- Object Appointment
    """
    appointment = appointment_by_id(id = appointment_id)

    user = user_by_id(id = user_id)

    subject = 'Recordatorio de cita médica'
    body_text = f'{user.first_name} {user.last_name}:'\
              f'Le recordamos su cita médica con fecha {appointment.date} y hora {appointment.time} '\
              f'se realizará en 24 horas.\n'\
              f'Estaremos en constante notificación sobre eventos y anuncios del consultorio.'     

    email_send(subject=subject, body_text=body_text, user_id=user_id, body_html=None)
    
    return user



def appointment_accept_email_send(
    *,
    appointment_id: int,
    user_id: int
    ):

    appointment = appointment_by_id(id=appointment_id)
    
    user = user_by_id(id=user_id)
    
    subject = 'Reutilización de cita médica.'
    body_text = f'{user.first_name} {user.last_name}'\
              f'\nSu cita médica con fecha {appointment.date} y hora '\
              f'{appointment.time} ha sido asignada con éxito.'
    
    email_send(subject=subject, body_text=body_text, user_id=user_id, body_html=None)
    
    return user



def appointment_assign_create_email_send(
    *,
    appointment_assign_id: int
    ):
    """Allows users to be notified by email when an unavailable day 
       has been assigned for generating appointments


    Parameters:
    appointment_assign_id -- Appointment id
    """    
    # Users list
    users = [x.id for x in user_all()]

    # Appointment assign
    appointment_assign = appointment_assign_by_id(id = appointment_assign_id)

    subject = 'Actualización de horario de atención'
    body_text = 'El administrador de la aplicación ha actualizado '\
              f'los días de atención. Este { appointment_assign.date} '\
              f'a partir de las {appointment_assign.time} no se atenderá '\
              'por decisiones de la administración. Para más información'\
              'consulte nuestra aplicación móvil.'

    emails_send(subject=subject, body_text=body_text, users=users, body_html=None)

    return users