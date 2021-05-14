from django.db import models
from django.utils.translation import gettext_lazy as _
from medical_appointment.users.models import BaseUser


class Email(models.Model):
    """
    This is a record of an email sent to a user.
    """
    user = models.ForeignKey(BaseUser, related_name='emails',on_delete=models.CASCADE)

    subject = models.TextField(max_length=255)
    body_text = models.TextField()
    body_html = models.TextField(blank=True, null=True)

    date_sent = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        app_label = 'communication'
        ordering = ['-date_sent']

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args,**kwargs)
        
    def __str__(self):
        if self.user:
            return _("Email de %(user)s con propósito '%(subject)s'") % {
                'user': self.user.email, 'subject': self.subject}
