import { Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import React from 'react'
import Stats from "../../components/stats";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const formatActivityLevel = (level?: string) => {
    const levels: { [key: string]: string } = {
      'SED': 'Sedentary',
      'LAC': 'Lightly Active',
      'MAC': 'Moderately Active',
      'VAC': 'Very Active',
      'EAC': 'Extra Active',
    };
    return level ? levels[level] || level : 'Not set';
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <View>
        {/* User Header */}
        <View className="bg-white rounded-lg p-6 mb-4 items-center">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            {user?.full_name || user?.username || 'User'}
          </Text>
          <Text className="text-gray-600 mb-4">@{user?.username}</Text>
          
          {/* User Stats */}
          {user && (
            <View className="w-full">
              <View className="flex-row justify-around mb-4">
                <View className="items-center">
                  <Text className="text-lg font-bold text-blue-500">
                    {user.height ? `${user.height} cm` : 'Not set'}
                  </Text>
                  <Text className="text-xs text-gray-600">Height</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-green-500">
                    {user.currWeight ? `${user.currWeight} kg` : 'Not set'}
                  </Text>
                  <Text className="text-xs text-gray-600">Weight</Text>
                </View>
              </View>
              
              <View className="items-center mb-4">
                <Text className="text-sm font-medium text-gray-700">
                  Activity Level: {formatActivityLevel(user.activityLevel)}
                </Text>
                <Text className="text-sm text-gray-500">
                  Member since {new Date(user.date_joined).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
          
          {/* Action Buttons */}
          <View className="flex-row gap-3 w-full">
            <TouchableOpacity className="flex-1 bg-gray-500 rounded-lg py-3">
              <Text className="text-white text-center font-semibold">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-red-500 rounded-lg py-3"
              onPress={handleLogout}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-semibold">
                {isLoading ? 'Logging out...' : 'Logout'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Component */}
        <Stats />
      </View>
    </ScrollView>
  )
}

export default Profile