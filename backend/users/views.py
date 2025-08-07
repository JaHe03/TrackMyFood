from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import CustomUser
from .serializer import CustomUserDetailsSerializer, UserProfileSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer to include user data in response"""
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add custom user data to the response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom login view that returns user data with tokens"""
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user's profile information"""
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update current user's profile information"""
    serializer = CustomUserDetailsSerializer(request.user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user's password"""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not old_password or not new_password:
        return Response(
            {'error': 'Both old_password and new_password are required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not user.check_password(old_password):
        return Response(
            {'error': 'Old password is incorrect'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Password changed successfully'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    """Delete user's account"""
    password = request.data.get('password')
    
    if not password:
        return Response(
            {'error': 'Password is required to delete account'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not request.user.check_password(password):
        return Response(
            {'error': 'Password is incorrect'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    request.user.delete()
    return Response({'message': 'Account deleted successfully'})

@api_view(['GET'])
@permission_classes([AllowAny])
def auth_status(request):
    """Check if user is authenticated"""
    if request.user.is_authenticated:
        serializer = UserProfileSerializer(request.user)
        return Response({
            'authenticated': True,
            'user': serializer.data
        })
    else:
        return Response({
            'authenticated': False,
            'user': None
        })

class UserListView(generics.ListAPIView):
    """List all users (admin only)"""
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only allow staff users to see all users
        if self.request.user.is_staff:
            return User.objects.all()
        else:
            # Regular users can only see their own profile
            return User.objects.filter(id=self.request.user.id)
