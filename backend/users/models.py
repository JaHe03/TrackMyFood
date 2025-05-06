from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

# Create your models here.

class CustomUser(AbstractUser):
    #NOTE
    # AbstractUser already provides: username, first_name, last_name, email,
    # password, groups, user_permissions, is_staff, is_active, is_superuser,
    # last_login, date_joined

    # Add any additional fields you want to include in your custom user model

    dob = models.DateField(_('Date of Birth'), null=True, blank=True)

    height = models.DecimalField(_('Height (cm)'), max_digits=5, decimal_places=2 ,null=True, blank=True)
    currWeight = models.DecimalField(_('Current Weight (kg)'), max_digits=5, decimal_places=2, null=True, blank=True)


    # activity level
    class activityLevel(models.TextChoices):
        SEDENTARY = 'SED', _('Sedentary (little or no exercise)')
        LIGHTLY_ACTIVE = 'LAC', _('Lightly active (light exercise/sports 1-3 days/week)')
        MODERATELY_ACTIVE = 'MAC', _('Moderately active (moderate exercise/sports 3-5 days/week)')
        VERY_ACTIVE = 'VAC', _('Very active (hard exercise/sports 6-7 days a week)')
        EXTRA_ACTIVE = 'EAC', _('Extra active (very hard exercise/sports & physical job or training twice a day)')

    activityLevel = models.CharField(
        _('Activity Level'),
        max_length=3,
        choices=activityLevel.choices,
        null=True,
        blank=True
    )

    # unit preference
    class unitPreference(models.TextChoices):
        METRIC = 'MET', _('Metric (kg, cm)')
        IMPERIAL = 'IMP', _('Imperial (lb, in)')

    unitPreference = models.CharField(
        _('Unit Preference'),
        max_length=3,
        choices=unitPreference.choices,
        default=unitPreference.METRIC,
    )




    def __str__(self):
        return self.username
