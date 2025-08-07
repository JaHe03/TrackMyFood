# backend/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser 

# Define the custom admin class (can include fieldsets, list_display, etc. as before)
class CustomUserAdmin(UserAdmin):
    
    model = CustomUser
    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'is_staff',
        'dob',
        'height', # Use the field name from models.py
        'currWeight', # Use the field name from models.py
        'activityLevel', # Use the field name from models.py
        'unitPreference', # Use the field name from models.py
        'date_joined',
        'last_login',
    )
    
    list_filter = UserAdmin.list_filter + (
        'activityLevel',
        'unitPreference',
    )
    
    search_fields = UserAdmin.search_fields + (
        'dob',
    )

    # Copy default fieldsets
    fieldsets = list(UserAdmin.fieldsets)

    # Add a new fieldset for your custom profile data
    # (This is often cleaner than trying to insert into existing ones)
    fieldsets.append(
        ('Custom Profile Data', {
            'fields': ('dob', 'height', 'currWeight', 'activityLevel', 'unitPreference'),
        })
    )

    # Also add fields to the 'add user' form (add_fieldsets)
    add_fieldsets = list(UserAdmin.add_fieldsets)
    # The typical structure is ((None, {'fields': (...)})), add to the inner tuple
    # Find the fieldset containing 'email' or similar to add after standard fields
    for fieldset_tuple in add_fieldsets:
        if 'email' in fieldset_tuple[1]['fields']: # Find the main fieldset
             original_fields = list(fieldset_tuple[1]['fields'])
             original_fields.extend(['dob', 'height', 'currWeight', 'activityLevel', 'unitPreference'])
             fieldset_tuple[1]['fields'] = tuple(original_fields)
             break


# --- THIS IS THE CRUCIAL LINE ---
# Register your CustomUser model with the CustomUserAdmin options
admin.site.register(CustomUser, CustomUserAdmin)
# ---------------------------------

# Customize admin site headers
admin.site.site_header = "TrackMyFood Admin"
admin.site.site_title = "TrackMyFood Admin Portal"
admin.site.index_title = "Welcome to TrackMyFood Administration"
