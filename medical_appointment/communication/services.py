from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.validators import ValidationError

from medical_appointment.users.selectors import user_by_id
from .models import Email
from .utils import email_async


def email_users_create(*, users, subject: str, body_text:str, body_html):
    """Allows notifying users by email in bulk and saves sent email objects


    Parameters:
    user -- Array users users send mail
    content -- Content users send mail  
    """
    # Send email
    emails_send(subject=subject, body_text=body_text, users=users)

    # Save user id in instance Email and content
    emails = emails_create(users=users, subject=subject, body_text=body_text, body_html=body_html)

    return emails


def email_create(*,user_id:int, subject:str, body_text:str, body_html:str):
    """Allows you users register the sending of a email in the database.


    Parameters:
    user_id int -- User identification
    subject str -- Title email
    body_text str -- Content email

    """
    email = Email(
        user_id=user_id,
        subject=subject,
        body_text=body_text,
        body_html=body_html
    )
    email.save()
    
    return email


def emails_create(*, users, subject:str, body_text:str, body_html:str):
    """Allows you users register a list of users of the sending of a
       email in the database


    Parameters:
    users [int] -- List contain ids users users send email

    """
    data = []
    for user in users:
        data.append(
            Email(
                user_id=user,
                subject=subject,
                body_text=body_text,
                body_html=body_html))

    # Save array instance emails
    emails = Email.objects.bulk_create(data)
    return emails



@email_async
def email_send_message(*,subject:str, body_text:str, users, body_html=None):
    """This function allow send email


    Parameters:
    title -- Title email
    content -- Content and body email
    users -- List users users send email
    """
    
    if not isinstance(users, list):
        users = list(users)
        
    message = EmailMultiAlternatives(subject, body_text, settings.EMAIL_HOST_USER,users)
    message.attach_alternative(body_text, 'text/plain')
    message.send(fail_silently=True)


def email_send(*,subject:str, body_text:str, body_html:str, user_id:int):
    """Allows you users send an email and register it in the database as long
       as it SAVE_SENT_EMAILS_users_DB is bool True in the configurations.

    Parameters:
    title str -- Title email
    content str -- Content email users send
    user_id int -- User identification

    """
    user = user_by_id(id=user_id)

    email_send_message(subject=subject, body_text=body_text, users=[user.email], body_html=body_html)

    if settings.SAVE_SENT_EMAILS_TO_DB:
        email_create(
            user_id=user.id,
            subject=subject,
            body_text=body_text,
            body_html=body_html
        )


def emails_send(*, subject:str, body_text:str, users, body_html=None):
    """It allows users send mass e-mail and register it in the database
    as long as it SAVE_SENT_EMAILS_users_DB is bool True in the configurations.


    Parameters:
    title str -- Title email
    content str -- Content email users send
    users [] -- User email users send email

    """
    if not users:
        raise ValidationError('Lista de usuarios requerida.')
    
    for user in users:
        email_send(
            subject=subject,
            body_text=body_text,
            user_id=user,
            body_html=body_html
        )
    
    return users
    
    

