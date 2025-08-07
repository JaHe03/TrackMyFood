from rest_framework import serializers
from django.contrib.auth import get_user_model
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import UserDetailsSerializer
from .models import CustomUser

User = get_user_model()

class CustomRegisterSerializer(RegisterSerializer):
    """Custom registration serializer to include additional user fields"""
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30, required=False)
    dob = serializers.DateField(required=False)
    height = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    currWeight = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    
    # Use the TextChoices classes directly instead of the model fields
    ACTIVITY_CHOICES = [
        ('SED', 'Sedentary (little or no exercise)'),
        ('LAC', 'Lightly active (light exercise/sports 1-3 days/week)'),
        ('MAC', 'Moderately active (moderate exercise/sports 3-5 days/week)'),
        ('VAC', 'Very active (hard exercise/sports 6-7 days a week)'),
        ('EAC', 'Extra active (very hard exercise/sports & physical job or training twice a day)'),
    ]
    
    UNIT_CHOICES = [
        ('MET', 'Metric (kg, cm)'),
        ('IMP', 'Imperial (lb, in)'),
    ]
    
    activityLevel = serializers.ChoiceField(choices=ACTIVITY_CHOICES, required=False)
    unitPreference = serializers.ChoiceField(choices=UNIT_CHOICES, required=False)

    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.update({
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'dob': self.validated_data.get('dob', None),
            'height': self.validated_data.get('height', None),
            'currWeight': self.validated_data.get('currWeight', None),
            'activityLevel': self.validated_data.get('activityLevel', None),
            'unitPreference': self.validated_data.get('unitPreference', 'MET'),  # Use string value directly
        })
        return data

    def save(self, request):
        user = super().save(request)
        cleaned_data = self.get_cleaned_data()
        
        # Update additional fields
        user.first_name = cleaned_data.get('first_name', '')
        user.last_name = cleaned_data.get('last_name', '')
        user.dob = cleaned_data.get('dob')
        user.height = cleaned_data.get('height')
        user.currWeight = cleaned_data.get('currWeight')
        user.activityLevel = cleaned_data.get('activityLevel')
        user.unitPreference = cleaned_data.get('unitPreference', 'MET')  # Use string value directly
        user.save()
        
        return user


class CustomUserDetailsSerializer(UserDetailsSerializer):
    """Custom user details serializer to include additional fields"""
    dob = serializers.DateField(required=False, allow_null=True)
    height = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    currWeight = serializers.DecimalField(max_digits=5, decimal_places=2, required=False, allow_null=True)
    
    # Use the same choices as defined above
    ACTIVITY_CHOICES = [
        ('SED', 'Sedentary (little or no exercise)'),
        ('LAC', 'Lightly active (light exercise/sports 1-3 days/week)'),
        ('MAC', 'Moderately active (moderate exercise/sports 3-5 days/week)'),
        ('VAC', 'Very active (hard exercise/sports 6-7 days a week)'),
        ('EAC', 'Extra active (very hard exercise/sports & physical job or training twice a day)'),
    ]
    
    UNIT_CHOICES = [
        ('MET', 'Metric (kg, cm)'),
        ('IMP', 'Imperial (lb, in)'),
    ]
    
    activityLevel = serializers.ChoiceField(choices=ACTIVITY_CHOICES, required=False, allow_null=True)
    unitPreference = serializers.ChoiceField(choices=UNIT_CHOICES, required=False)

    class Meta:
        model = User
        fields = (
            'pk', 'username', 'email', 'first_name', 'last_name',
            'dob', 'height', 'currWeight', 'activityLevel', 'unitPreference'
        )
        read_only_fields = ('pk', 'username')

    def update(self, instance, validated_data):
        """Update user instance with validated data"""
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.dob = validated_data.get('dob', instance.dob)
        instance.height = validated_data.get('height', instance.height)
        instance.currWeight = validated_data.get('currWeight', instance.currWeight)
        instance.activityLevel = validated_data.get('activityLevel', instance.activityLevel)
        instance.unitPreference = validated_data.get('unitPreference', instance.unitPreference)
        instance.save()
        return instance


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile information"""
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = (
            'pk', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'dob', 'height', 'currWeight', 'activityLevel', 'unitPreference',
            'date_joined', 'last_login'
        )
        read_only_fields = ('pk', 'username', 'date_joined', 'last_login')

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username