from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication endpoints
    path('login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth-status/', views.auth_status, name='auth_status'),
    
    # User profile endpoints
    path('profile/', views.user_profile, name='user_profile'),
    path('profile/update/', views.update_user_profile, name='update_user_profile'),
    path('change-password/', views.change_password, name='change_password'),
    path('delete-account/', views.delete_account, name='delete_account'),
    
    # User management
    path('users/', views.UserListView.as_view(), name='user_list'),
]